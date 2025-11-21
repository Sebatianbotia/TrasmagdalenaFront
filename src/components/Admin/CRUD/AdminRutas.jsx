import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminRutas() {
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedRoute, setSelectedRoute] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const [formData, setFormData] = useState({
        code: '',
        originId: '',
        destinationId: '',
        distanceKm: '',
        durationTime: ''
    });

    useEffect(() => {
        fetchRoutes();
    }, [currentPage]);

    const fetchRoutes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/route/all?page=${currentPage}&size=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las rutas');
            }

            const data = await response.json();
            setRoutes(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAdd = async () => {
        try {
            // Validar campos obligatorios
            if (!formData.code || !formData.originId || !formData.destinationId || 
                !formData.distanceKm || !formData.durationTime) {
                alert('Por favor completa todos los campos');
                return;
            }

            const routeData = {
                code: formData.code,
                originId: parseInt(formData.originId),
                destinationId: parseInt(formData.destinationId),
                distanceKm: parseFloat(formData.distanceKm),
                durationTime: parseFloat(formData.durationTime)
            };

            const response = await fetch('http://localhost:8080/api/v1/route/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(routeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Datos no válidos");
            }

            const data = await response.json();
            
            setFormData({
                code: '',
                originId: '',
                destinationId: '',
                distanceKm: '',
                durationTime: ''
            });
            
            setView('list');
            fetchRoutes();

        } catch (error) {
            console.error('Error al crear la ruta:', error);
            alert('Error: ' + error.message);
        }
    };

    const handleEdit = (route) => {
        setSelectedRoute(route);
        setFormData({
            code: route.code || '',
            originId: route.originId ?? '',
            destinationId: route.destinationId ?? '',
            distanceKm: route.distanceKm ?? '',
            durationTime: route.durationTime ?? ''
        });
        setView('edit');
    };

    const handleUpdate = async () => {
        try {
            const routeData = {
                code: formData.code || undefined,
                originId: formData.originId ? parseInt(formData.originId) : undefined,
                destinationId: formData.destinationId ? parseInt(formData.destinationId) : undefined,
                distanceKm: formData.distanceKm ? parseFloat(formData.distanceKm) : undefined,
                durationTime: formData.durationTime ? parseFloat(formData.durationTime) : undefined
            };

            Object.keys(routeData).forEach(key => 
                routeData[key] === undefined && delete routeData[key]
            );

            const response = await fetch(`http://localhost:8080/api/v1/route/update/${selectedRoute.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(routeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar");
            }

            setFormData({
                code: '',
                originId: '',
                destinationId: '',
                distanceKm: '',
                durationTime: ''
            });
            fetchRoutes();
            setView('list');
        } catch (error) {
            console.error('Error:', error.message);
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta ruta?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/route/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error("No se pudo eliminar la ruta");
                }

                fetchRoutes();
            } catch (error) {
                console.error('Error:', error.message);
                alert('Error: ' + error.message);
            }
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

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {view === 'list' && (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Distancia (km)</th>
                                <th>Duración (hrs)</th>
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

                    {/* Paginación */}
                    <div className="pagination">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="btn btn--secondary"
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage + 1} de {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="btn btn--secondary"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {(view === 'add' || view === 'edit') && (
                <div className="form-container">
                    <h3 className="form-title">
                        {view === 'add' ? 'Agregar Nueva Ruta' : 'Editar Ruta'}
                    </h3>
                    <div className="form">
                        <div className="form-group">
                            <label>Código *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                placeholder="Ej: RUT-001"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Origen *</label>
                            <input
                                type="number"
                                name="originId"
                                value={formData.originId}
                                onChange={handleInputChange}
                                placeholder="Ej: 1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Destino *</label>
                            <input
                                type="number"
                                name="destinationId"
                                value={formData.destinationId}
                                onChange={handleInputChange}
                                placeholder="Ej: 2"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Distancia (km) *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="distanceKm"
                                value={formData.distanceKm}
                                onChange={handleInputChange}
                                placeholder="Ej: 150.5"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Duración (horas) *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="durationTime"
                                value={formData.durationTime}
                                onChange={handleInputChange}
                                placeholder="Ej: 2.5"
                                required
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
                            <span className="detail-label">Duración (horas):</span>
                            <span className="detail-value">{selectedRoute.durationTime}</span>
                        </div>

                        {selectedRoute.routeStops && selectedRoute.routeStops.length > 0 && (
                            <div className="detail-item">
                                <span className="detail-label">Paradas:</span>
                                <div className="detail-value">
                                    {selectedRoute.routeStops.map((stop, index) => (
                                        <div key={stop.id} style={{ marginBottom: '8px' }}>
                                            <strong>#{stop.stopOrder}</strong> {stop.origin} → {stop.destination}
                                            <br />
                                            <small>
                                                Precio: ${stop.price}
                                                {stop.isDinamycPricing && ' (Precio dinámico)'}
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="btn btn--primary" onClick={() => setView('list')}>
                        Volver a la lista
                    </button>
                </div>
            )}
        </div>
    );
}