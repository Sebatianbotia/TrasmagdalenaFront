import { useState, useEffect } from "react";
import InformationCard from "../informationCard";
import "../../../styles/Admin/CRUD/dashboard.css";

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalBuses: 0,
        activeRoutes: 0,
        drivers: 0,
        passengers: 0,
        dispatchers: 0,
        monthlyRevenue: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Hacer todas las peticiones en paralelo
            const [busesRes, routesRes, driversRes, passengersRes, dispatchersRes] = await Promise.all([
                fetch('http://localhost:8080/api/v1/bus/count'),
                fetch('http://localhost:8080/api/v1/route/count'),
                fetch('http://localhost:8080/api/v1/user/count/DRIVER'),
                fetch('http://localhost:8080/api/v1/user/count/PASSENGER'),
                fetch('http://localhost:8080/api/v1/user/count/DISPATCHER')
            ]);

            // Verificar que todas las respuestas sean exitosas
            if (!busesRes.ok || !routesRes.ok || !driversRes.ok || !passengersRes.ok || !dispatchersRes.ok) {
                console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                throw new Error('Error al obtener datos del servidor');
            }

            // Convertir todas las respuestas a JSON
            const [buses, routes, drivers, passengers, dispatchers] = await Promise.all([
                busesRes.json(),
                routesRes.json(),
                driversRes.json(),
                passengersRes.json(),
                dispatchersRes.json()
            ]);

            // Actualizar el estado con los datos obtenidos
            setDashboardData({
                totalBuses: buses,
                activeRoutes: routes,
                drivers: drivers,
                passengers: passengers,
                dispatchers: dispatchers,
                monthlyRevenue: 0 // Este lo puedes agregar cuando tengas el endpoint
            });

        } catch (err) {
            console.error('Error cargando datos del dashboard:', err);
            setError('No se pudieron cargar los datos. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <h3>Resumen General</h3>
                <p>Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h3>Resumen General</h3>
                <p className="error-message">{error}</p>
                <button onClick={loadDashboardData} className="retry-button">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <>
            <h3>Resumen General</h3>
            <div className="information__div">
                <InformationCard 
                    cardTittle="Total buses" 
                    number={dashboardData.totalBuses.toString()} 
                />
                <InformationCard 
                    cardTittle="Rutas Activas" 
                    number={dashboardData.activeRoutes.toString()} 
                />
                <InformationCard 
                    cardTittle="Conductores Registrados" 
                    number={dashboardData.drivers.toString()} 
                />
                <InformationCard 
                    cardTittle="Usuarios Registrados" 
                    number={dashboardData.passengers.toString()} 
                />
                <InformationCard 
                    cardTittle="Despachadores Registrados" 
                    number={dashboardData.dispatchers.toString()} 
                />
                <InformationCard 
                    cardTittle="Total generado este mes" 
                    number={formatCurrency(dashboardData.monthlyRevenue)} 
                />
            </div>
        </>
    );
}