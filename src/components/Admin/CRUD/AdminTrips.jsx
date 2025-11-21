import { useEffect,useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminTrips() {
    const [trips, setTrips] = useState([]);
        const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedTrip, setSelectedTrip] = useState(null);

     const[currentPage, setCurrentPage] = useState(0);
    const[totalPages, setTotalpages] = useState(0)
    const[pageSize] = useState(20);

    const [formData, setFormData] = useState({
        busId: '',
        routeId: '',
        date: '',
        departureAt: '',
        arrivalAt: '',
        tripStatus: '',
        fareRuleId: ''
    });

    useEffect(()=>{
            fetchTrips();
        }, [currentPage]);// se va a ejecutar cuando cambie la pagina
    
    const fetchTrips = async () => {
            setLoading(true);
            setError(null);
    
            const response = await fetch(`http://localhost:8080/api/v1/trip/all?page=${currentPage}&size=${pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-type':'application/json'
                        //Cuando implementemos el JWT (API:JS)
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if(!response.ok){
                throw new Error('Error al cargar las asignaciones');
            }
    
            const data = await response.json(); //convertimos el response a json
    
            setTrips(data.content); 
            setTotalpages(data.totalPages);
        }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            busId: '',
            routeId: '',
            date: '',
            departureAt: '',
            arrivalAt: '',
            tripStatus: '',
            fareRuleId: ''
        });
    };
    const handleAdd = async () => {
            try{
                        // Convertir datetime-local a OffsetDateTime con zona horaria
            const response = await fetch('http://localhost:8080/api/v1/trip/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Datos no válidos");
            }

             const data = await response.json();
             setTrips([...trips, data]);

             setFormData({
                busId: '',
                routeId: '',
                date: '',
                departureAt: '',
                arrivalAt: '',
                tripStatus: '',
                fareRuleId: ''
             });
        
            setView('list');
        
     } catch (error) {
         console.error('Error al crear el viaje:', error);
         alert('Error: ' + error.message);
     }

     };

    const handleEdit = (trip) => {
        setSelectedTrip(trip);
        setFormData({
            busId: trip.busId ?? '',
            routeId: trip.routeId ?? '',
            date: trip.date ?? '',
            departureAt: trip.departureAt ?? trip.departTime ?? '',
            arrivalAt: trip.arrivalAt ?? trip.arriveTime ?? '',
            tripStatus: trip.status ?? '',
            fareRuleId: trip.fareRuleId ?? ''
        });
        setView('edit');
    };

    const handleUpdate = async () => {
        try{
            const response = await fetch(`http://localhost:8080/api/v1/trip/update/${selectedTrip.id}`,
                {
                    method:'PATCH',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(formData)
                }
            )
            if(!response.ok){
                const errorData = await response.json
                throw new Error(errorData.message || "Error al actualizar")
            }
            console.log (formData)
    
            setFormData({
                busId: '',
                routeId: '',
                date: '',
                departureAt: '',
                arrivalAt: '',
                tripStatus: '',
                fareRuleId: ''
            });

            fetchTrips();
            setView('list');
        }
        catch(error){
            console.error('Error:',error.message);
            alert("Error: " + error.message)
        }
    };

const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta ciudad?')) {
            try{
                const response = await fetch (`http://localhost:8080/api/v1/trip/delete/${id}`,
                    {
                        method: 'DELETE',
                        headers:{
                            'Content-Type':'application/json'
                        }
                    }
                )
                if(!response.ok){
                    throw new Error("No se pudo eliminar hp")
                }
                fetchTrips();
            }
            catch(error){
                console.error('Error: '+ error.message);
                alert('Error: '+ error.message);
            }
        }
    };

    const handleDetail = (trip) => {
        setSelectedTrip(trip);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Viajes</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Viaje
                    </button>
                )}
                {view !== 'list' && (
                    <button className="btn btn--secondary" onClick={() => setView('list')}>
                        ← Volver
                    </button>
                )}
            </div>

            {view === 'list' && (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Fecha</th>
                                <th>Salida</th>
                                <th>Llegada</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Bus</th>
                                <th>Asientos disp.</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map(trip => (
                                <tr key={trip.id}>
                                    <td>{trip.origin}</td>
                                    <td>{trip.destination}</td>
                                    <td>{trip.date}</td>
                                    <td>{trip.departTime}</td>
                                    <td>{trip.arriveTime}</td>
                                    <td>{trip.price}</td>
                                    <td>{trip.status}</td>
                                    <td>{trip.busPlate}</td>
                                    <td>{trip.seatAvailable}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(trip)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(trip)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(trip.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(view === 'add' || view === 'edit') && (
                <div className="form-container">
                    <h3 className="form-title">
                        {view === 'add' ? 'Agregar Nuevo Viaje' : 'Editar Viaje'}
                    </h3>
                    <div className="form">
                        <div className="form-group">
                            <label>ID Bus (busId)</label>
                            <input
                                type="number"
                                name="busId"
                                value={formData.busId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Ruta (routeId)</label>
                            <input
                                type="number"
                                name="routeId"
                                value={formData.routeId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha del viaje (date)</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hora de salida (departureAt)</label>
                            <input
                                type="datetime-local"
                                name="departureAt"
                                value={formData.departureAt}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hora de llegada (arrivalAt)</label>
                            <input
                                type="datetime-local"
                                name="arrivalAt"
                                value={formData.arrivalAt}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado del viaje (tripStatus)</label>
                            <input
                                type="text"
                                name="tripStatus"
                                value={formData.tripStatus}
                                onChange={handleInputChange}
                                placeholder="Ej: SCHEDULED, CANCELED..."
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Regla de tarifa (fareRuleId)</label>
                            <input
                                type="number"
                                name="fareRuleId"
                                value={formData.fareRuleId}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-buttons">
                            <button
                                className="btn btn--primary"
                                onClick={view === 'add' ? handleAdd : handleUpdate}
                            >
                                {view === 'add' ? 'Guardar' : 'Actualizar'}
                            </button>
                            <button
                                className="btn btn--secondary"
                                onClick={() => setView('list')}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'detail' && selectedTrip && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Viaje</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedTrip.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Origen:</span>
                            <span className="detail-value">{selectedTrip.origin}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Destino:</span>
                            <span className="detail-value">{selectedTrip.destination}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Fecha:</span>
                            <span className="detail-value">{selectedTrip.date}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Hora salida:</span>
                            <span className="detail-value">{selectedTrip.departTime}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Hora llegada:</span>
                            <span className="detail-value">{selectedTrip.arriveTime}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Precio:</span>
                            <span className="detail-value">{selectedTrip.price}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Estado:</span>
                            <span className="detail-value">{selectedTrip.status}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Bus (placa):</span>
                            <span className="detail-value">{selectedTrip.busPlate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID Bus:</span>
                            <span className="detail-value">{selectedTrip.busId}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID Ruta:</span>
                            <span className="detail-value">{selectedTrip.routeId}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID Regla tarifa (fareRuleId):</span>
                            <span className="detail-value">{selectedTrip.fareRuleId}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Asientos disponibles:</span>
                            <span className="detail-value">{selectedTrip.seatAvailable}</span>
                        </div>
                    </div>
                    <button className="btn btn--primary" onClick={() => setView('list')}>
                        Volver a la lista
                    </button>
                </div>
            )}
        </div>
    );
}
