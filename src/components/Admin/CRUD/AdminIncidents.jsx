import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminIncidents() {
    const [incidents, setIncidents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedIncident, setSelectedIncident] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const [formData, setFormData] = useState({
        incidentType: 'SECURITY',
        entityId: '',
        entityType: 'TRIP',
        note: '',
        createdAt: ''
    });

    useEffect(() => {
        fetchIncidents();
    }, [currentPage]);

    const fetchIncidents = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/incident/all?page=${currentPage}&size=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los incidentes');
            }

            const data = await response.json();
            setIncidents(data.content);
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
            const incidentData = {
                incidentType: formData.incidentType,
                entityId: parseInt(formData.entityId),
                entityType: formData.entityType,
                note: formData.note,
                createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
            };

            const response = await fetch('http://localhost:8080/api/v1/incident/create', {
                method: 'POST',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(incidentData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Datos no válidos");
            }

            const data = await response.json();
            setIncidents([...incidents, data]);
            
            setFormData({
                incidentType: 'SECURITY',
                entityId: '',
                entityType: 'TRIP',
                note: '',
                createdAt: ''
            });
            setView('list');
            fetchIncidents();

        } catch (error) {
            console.error('Error al crear el incidente:', error);
            alert('Error: ' + error.message);
        }
    };

    const handleEdit = (incident) => {
        setSelectedIncident(incident);
        setFormData({
            incidentType: incident.incidentType,
            entityId: incident.entityId.toString(),
            entityType: incident.entityType,
            note: incident.note,
            createdAt: incident.createdAt ? incident.createdAt.slice(0, 16) : ''
        });
        setView('edit');
    };

    const handleUpdate = async () => {
        try {
            const incidentData = {
                incidentType: formData.incidentType,
                entityId: parseInt(formData.entityId),
                entityType: formData.entityType,
                note: formData.note,
                createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
            };

            const response = await fetch(`http://localhost:8080/api/v1/incident/update/${selectedIncident.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(incidentData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar");
            }

            setFormData({
                incidentType: 'SECURITY',
                entityId: '',
                entityType: 'TRIP',
                note: '',
                createdAt: ''
            });
            fetchIncidents();
            setView('list');
        } catch (error) {
            console.error('Error:', error.message);
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este incidente?')) {
            try {
                // Nota: El endpoint DELETE no está en el controlador, usaríamos PATCH para "soft delete" o implementar DELETE
                alert('Endpoint DELETE no disponible en el controlador. Use actualización en su lugar.');
            } catch (error) {
                console.error('Error: ' + error.message);
                alert('Error: ' + error.message);
            }
        }
    };

    const handleDetail = (incident) => {
        setSelectedIncident(incident);
        setView('detail');
    };

    const getEntityTypeText = (entityType) => {
        const entityTypeMap = {
            'TRIP': 'Viaje',
            'TICKET': 'Tiquete',
            'PARCEL': 'Paquete'
        };
        return entityTypeMap[entityType] || entityType;
    };

    const getIncidentTypeText = (incidentType) => {
        const incidentTypeMap = {
            'SECURITY': 'Seguridad',
            'DELIVERY_FAIL': 'Falla en Entrega',
            'OVERBOOK': 'Sobreventa',
            'VEHICLE': 'Vehículo'
        };
        return incidentTypeMap[incidentType] || incidentType;
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'No especificada';
        return new Date(dateTime).toLocaleString('es-CO');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Incidentes</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Incidente
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
                                <th>Tipo Entidad</th>
                                <th>ID Entidad</th>
                                <th>Tipo Incidente</th>
                                <th>Nota</th>
                                <th>Creado el</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map(incident => (
                                <tr key={incident.id}>
                                    <td>{getEntityTypeText(incident.entityType)}</td>
                                    <td>{incident.entityId}</td>
                                    <td>{getIncidentTypeText(incident.incidentType)}</td>
                                    <td className="truncate-text" title={incident.note}>
                                        {incident.note.length > 50 
                                            ? incident.note.substring(0, 50) + '...' 
                                            : incident.note}
                                    </td>
                                    <td>{formatDateTime(incident.createdAt)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(incident)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(incident)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(incident.id)}
                                                disabled
                                                title="Eliminar no disponible"
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
                        {view === 'add' ? 'Agregar Nuevo Incidente' : 'Editar Incidente'}
                    </h3>
                    <div className="form">
                        <div className="form-group">
                            <label>Tipo de Entidad</label>
                            <select
                                name="entityType"
                                value={formData.entityType}
                                onChange={handleInputChange}
                            >
                                <option value="TRIP">Viaje</option>
                                <option value="TICKET">Tiquete</option>
                                <option value="PARCEL">Paquete</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>ID de la Entidad</label>
                            <input
                                type="number"
                                name="entityId"
                                value={formData.entityId}
                                onChange={handleInputChange}
                                placeholder="Ej: 1001"
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Incidente</label>
                            <select
                                name="incidentType"
                                value={formData.incidentType}
                                onChange={handleInputChange}
                            >
                                <option value="SECURITY">Seguridad</option>
                                <option value="DELIVERY_FAIL">Falla en Entrega</option>
                                <option value="OVERBOOK">Sobreventa</option>
                                <option value="VEHICLE">Vehículo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Nota</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Descripción del incidente..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha de creación</label>
                            <input
                                type="datetime-local"
                                name="createdAt"
                                value={formData.createdAt}
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

            {view === 'detail' && selectedIncident && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Incidente</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedIncident.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Tipo de Entidad:</span>
                            <span className="detail-value">{getEntityTypeText(selectedIncident.entityType)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID de la Entidad:</span>
                            <span className="detail-value">{selectedIncident.entityId}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Tipo de Incidente:</span>
                            <span className="detail-value">{getIncidentTypeText(selectedIncident.incidentType)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nota:</span>
                            <span className="detail-value">{selectedIncident.note}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Creado el:</span>
                            <span className="detail-value">{formatDateTime(selectedIncident.createdAt)}</span>
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