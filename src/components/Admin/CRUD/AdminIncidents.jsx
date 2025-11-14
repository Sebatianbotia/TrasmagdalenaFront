import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminIncidents() {
    const [incidents, setIncidents] = useState([
        {
            id: 1,
            entityType: 'TRIP',
            entityId: 1001,
            incidentType: 'SECURITY',
            note: 'Discusión entre pasajeros durante el viaje.',
            createdAt: '2025-11-14T09:30'
        },
        {
            id: 2,
            entityType: 'TICKET',
            entityId: 5002,
            incidentType: 'DELIVERY_FAIL',
            note: 'El pasajero no se presentó al abordaje.',
            createdAt: '2025-11-14T10:15'
        }
    ]);

    const [view, setView] = useState('list');
    const [selectedIncident, setSelectedIncident] = useState(null);

    const [formData, setFormData] = useState({
        entityType: 'TRIP',
        entityId: '',
        incidentType: 'SECURITY',
        note: '',
        createdAt: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAdd = () => {
        setIncidents([
            ...incidents,
            {
                ...formData,
                id: incidents.length + 1,
                entityId: Number(formData.entityId)
            }
        ]);
        setFormData({
            entityType: 'TRIP',
            entityId: '',
            incidentType: 'SECURITY',
            note: '',
            createdAt: ''
        });
        setView('list');
    };

    const handleEdit = (incident) => {
        setSelectedIncident(incident);
        setFormData({
            entityType: incident.entityType,
            entityId: incident.entityId,
            incidentType: incident.incidentType,
            note: incident.note,
            createdAt: incident.createdAt
        });
        setView('edit');
    };

    const handleUpdate = () => {
        setIncidents(
            incidents.map(i =>
                i.id === selectedIncident.id
                    ? {
                        ...selectedIncident,
                        ...formData,
                        entityId: Number(formData.entityId)
                    }
                    : i
            )
        );
        setFormData({
            entityType: 'TRIP',
            entityId: '',
            incidentType: 'SECURITY',
            note: '',
            createdAt: ''
        });
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este incidente?')) {
            setIncidents(incidents.filter(i => i.id !== id));
        }
    };

    const handleDetail = (incident) => {
        setSelectedIncident(incident);
        setView('detail');
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
                                <td>{incident.entityType}</td>
                                <td>{incident.entityId}</td>
                                <td>{incident.incidentType}</td>
                                <td>{incident.note}</td>
                                <td>{incident.createdAt}</td>
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
                            <label>Tipo de Entidad (entityType)</label>
                            <select
                                name="entityType"
                                value={formData.entityType}
                                onChange={handleInputChange}
                            >
                                <option value="TRIP">TRIP</option>
                                <option value="TICKET">TICKET</option>
                                <option value="PARCEL">PARCEL</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>ID de la Entidad (entityId)</label>
                            <input
                                type="number"
                                name="entityId"
                                value={formData.entityId}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Incidente (incidentType)</label>
                            <select
                                name="incidentType"
                                value={formData.incidentType}
                                onChange={handleInputChange}
                            >
                                <option value="SECURITY">SECURITY</option>
                                <option value="DELIVERY_FAIL">DELIVERY_FAIL</option>
                                <option value="OVERBOOK">OVERBOOK</option>
                                <option value="VEHICLE">VEHICLE</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Nota</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha de creación (createdAt)</label>
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
                            <span className="detail-value">{selectedIncident.entityType}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID de la Entidad:</span>
                            <span className="detail-value">{selectedIncident.entityId}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Tipo de Incidente:</span>
                            <span className="detail-value">{selectedIncident.incidentType}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nota:</span>
                            <span className="detail-value">{selectedIncident.note}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Creado el:</span>
                            <span className="detail-value">{selectedIncident.createdAt}</span>
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
