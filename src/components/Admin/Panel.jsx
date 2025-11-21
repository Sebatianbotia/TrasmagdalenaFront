import { useState } from "react"
import "../../styles/Admin/panel.css"
import Dashboard from "./CRUD/Dashboard"
import AdminBuses from "./CRUD/AdminBuses"
import AdminAssingments from "./CRUD/AdminAssignments"
import AdminCities from "./CRUD/AdminCities"
import AdminConductores from "./CRUD/AdminConductores"
import AdminIncidents from "./CRUD/AdminIncidents"
import AdminRutas from "./CRUD/AdminRutas"
import AdminStops from "./CRUD/AdminStops"
import AdminTickets from "./CRUD/AdminTickets"
import AdminTrips from "./CRUD/AdminTrips"
import AdminUsers from "./CRUD/AdminUsers"
import AdminParcels from "./CRUD/AdminParcels"
import AdminAdmin from "./CRUD/AdminAdmin"
import AdminDispatcher from "./CRUD/AdminDispatcher"

export default function Panel({onClose}) {
    const [activeSection, setActiveSection] = useState('dashboard');

    const renderContent = () => {
        switch(activeSection) {
            case 'dashboard': return <Dashboard />;
            case 'buses': return <AdminBuses />;
            case 'rutas': return <AdminRutas />;
            case 'conductores': return <AdminConductores />;
            case 'usuarios': return <AdminUsers />;
            case 'asignaciones': return <AdminAssingments/>;
            case 'ciudades': return <AdminCities/>;
            case 'paradas': return <AdminStops />;
            case 'incidentes': return <AdminIncidents />;
            case 'tiquetes': return <AdminTickets />;
            case 'viajes': return <AdminTrips />;
            case 'parcels': return <AdminParcels />;
            case 'admin': return <AdminAdmin />;
            case 'dispatcher': return <AdminDispatcher/>;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="panel">
            <aside className="options">
                <div className="options__data">
                    <h4>Transmagdalena</h4>
                    <p>Panel de administrador</p>
                </div>
                <div className="options__actions">
                    <ul className="actions__list">
                        <li 
                            className={`action__item ${activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveSection('dashboard')}
                        >
                            Dashboard
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'admin' ? 'active' : ''}`}
                            onClick={() => setActiveSection('admin')}
                        >
                            Administradores
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'buses' ? 'active' : ''}`}
                            onClick={() => setActiveSection('buses')}
                        >
                            Administrar Buses
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'rutas' ? 'active' : ''}`}
                            onClick={() => setActiveSection('rutas')}
                        >
                            Administrar rutas
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'conductores' ? 'active' : ''}`}
                            onClick={() => setActiveSection('conductores')}
                        >
                            Administrar conductores
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'distparcher' ? 'active' : ''}`}
                            onClick={() => setActiveSection('dispatcher')}
                        >
                            Administrar Despachadores
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'usuarios' ? 'active' : ''}`}
                            onClick={() => setActiveSection('usuarios')}
                        >
                            Administrar usuarios
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'asignaciones' ? 'active' : ''}`}
                            onClick={() => setActiveSection('asignaciones')}
                        >
                            Administrar asignaciones
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'ciudades' ? 'active' : ''}`}
                            onClick={() => setActiveSection('ciudades')}
                        >
                            Administrar ciudades
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'paradas' ? 'active' : ''}`}
                            onClick={() => setActiveSection('paradas')}
                        >
                            Administrar paradas
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'parcels' ? 'active' : ''}`}
                            onClick={() => setActiveSection('parcels')}
                        >
                            Administrar parcels
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'incidentes' ? 'active' : ''}`}
                            onClick={() => setActiveSection('incidentes')}
                        >
                            Administrar incidentes
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'tiquetes' ? 'active' : ''}`}
                            onClick={() => setActiveSection('tiquetes')}
                        >
                            Administrar tiquetes
                        </li>
                        <li 
                            className={`action__item ${activeSection === 'viajes' ? 'active' : ''}`}
                            onClick={() => setActiveSection('viajes')}
                        >
                            Administrar viajes
                        </li>
                    </ul>
                </div>
                <button className="exit__btn" onClick={onClose}>Cerrar Sesion</button>
            </aside>
            <div className="panelInformation">
                {renderContent()}
            </div>
        </div>
    );
}