import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminRutas() {
    const [routes, setRoutes] = useState([]);
        const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedRoute, setSelectedRoute] = useState(null);

     const[currentPage, setCurrentPage] = useState(0);
    const[totalPages, setTotalpages] = useState(0)
    const[pageSize] = useState(10);

    const [formData, setFormData] = useState({
        code: '',
        originId: '',
        destinationId: ''
    });

        useEffect(()=>{
        fetchRoutes();
    }, [currentPage]);// se va a ejecutar cuando cambie la pagina

    const fetchRoutes = async () => {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8080/api/v1/route/all?page=${currentPage}&size=${pageSize}`,
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

        setRoutes(data.content); 
        setTotalpages(data.totalPages);
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

// const handleAdd = async () => {
//         try{
//                     // Convertir datetime-local a OffsetDateTime con zona horaria
//         const response = await fetch('http://localhost:8080/api/v1/route/create', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData) // JSON.stringify(formData)
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || "Datos no válidos");
//         }

//         const data = await response.json();
//         setRoutes([...routes, data]);

//         setFormData({
//             code: '',
//             originId: '',
//             destinationId: ''
//         });
        
//         setView('list');
        
//     } catch (error) {
//         console.error('Error al crear la ruta:', error);
//         alert('Error: ' + error.message);
//     }

//     };

    const handleEdit = (route) => {
        setSelectedRoute(route);
        setFormData({
            code: route.code || '',
            originId: route.originId ?? '',
            destinationId: route.destinationId ?? ''
        });
        setView('edit');
    };


    // const handleUpdate = async () => {
    //     try{
    //         const response = await fetch(`http://localhost:8080/api/v1/route/update/${selectedRoute.id}`,
    //             {
    //                 method:'PATCH',
    //                 headers:{
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body:JSON.stringify(formData)
    //             }
    //         )
    //         if(!response.ok){
    //             const errorData = await response.json
    //             throw new Error(errorData.message || "Error al actualizar")
    //         }
    
    //         setFormData({
    //              code: '',
    //             originId: '',
    //             destinationId: ''
    //         });
    //         fetchRoutes();
    //         setView('list');
    //     }
    //     catch(error){
    //         console.error('Error:',error.message);
    //         alert("Error: " + error.message)
    //     }
    // };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar esta ruta?')) {
            setRoutes(routes.filter(r => r.id !== id));
        }
    };

    const handleDetail = (route) => {
        setSelectedRoute(route);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Rutas</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Ruta
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
                                <th>Código</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Distancia (km)</th>
                                <th>Duración</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map(route => (
                                <tr key={route.id}>
                                    <td>{route.code}</td>
                                    <td>{route.origin}</td>
                                    <td>{route.destination}</td>
                                    <td>{route.distanceKm}</td>
                                    <td>{route.durationTime}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(route)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(route)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(route.id)}
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
                        {view === 'add' ? 'Agregar Nueva Ruta' : 'Editar Ruta'}
                    </h3>
                    <div className="form">
                        <div className="form-group">
                            <label>Código</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Origen (originId)</label>
                            <input
                                type="number"
                                name="originId"
                                value={formData.originId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Destino (destinationId)</label>
                            <input
                                type="number"
                                name="destinationId"
                                value={formData.destinationId}
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

            {view === 'detail' && selectedRoute && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle de la Ruta</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedRoute.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Código:</span>
                            <span className="detail-value">{selectedRoute.code}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Origen:</span>
                            <span className="detail-value">{selectedRoute.origin}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Destino:</span>
                            <span className="detail-value">{selectedRoute.destination}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Distancia (km):</span>
                            <span className="detail-value">{selectedRoute.distanceKm}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Duración:</span>
                            <span className="detail-value">{selectedRoute.durationTime}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Paradas (routeStops):</span>
                            <span className="detail-value">
                                {selectedRoute.routeStops && selectedRoute.routeStops.length > 0
                                    ? selectedRoute.routeStops
                                          .map(
                                              stop =>
                                                  `#${stop.stopOrder} ${stop.origin} → ${stop.destination} (${
                                                      stop.price
                                                  }${stop.isDinamycPricing ? ', dinámico' : ''})`
                                          )
                                          .join(' | ')
                                    : 'Sin paradas asociadas'}
                            </span>
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
