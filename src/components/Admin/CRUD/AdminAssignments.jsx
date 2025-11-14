import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminAssignments() {
    const [assignments, setAssignments] = useState([
        {
            id: 1,
            tripId: 1001,
            dispatcherId: 10,
            driverId: 20,
            checkList: true,
            assignedAt: '2025-11-14T10:00'
        },
        {
            id: 2,
            tripId: 1002,
            dispatcherId: 11,
            driverId: 21,
            checkList: false,
            assignedAt: '2025-11-14T12:30'
        }
    ]);

    const [view, setView] = useState('list');

    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const [formData, setFormData] = useState({
        tripId: '',
        dispatcherId: '',
        driverId: '',
        checkList: false,
        assignedAt: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAdd = () => {
        setAssignments([
            ...assignments,
            {
                ...formData,
                id: assignments.length + 1
            }
        ]);
        setFormData({
            tripId: '',
            dispatcherId: '',
            driverId: '',
            checkList: false,
            assignedAt: ''
        });
        setView('list');
    };

    const handleEdit = (assignment) => {
        setSelectedAssignment(assignment);
        setFormData(assignment);
        setView('edit');
    };

    const handleUpdate = () => {
        setAssignments(
            assignments.map(a =>
                a.id === selectedAssignment.id
                    ? { ...formData, id: selectedAssignment.id }
                    : a
            )
        );
        setFormData({
            tripId: '',
            dispatcherId: '',
            driverId: '',
            checkList: false,
            assignedAt: ''
        });
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
            setAssignments(assignments.filter(a => a.id !== id));
        }
    };

    const handleDetail = (assignment) => {
        setSelectedAssignment(assignment);
        setView('detail');
    };

    return (
    <>
            <div className="admin-buses">
                <div className="admin-buses__header">
                    <h2 className="admin-buses__title">Administrar Asignaciones</h2>
                    {view === 'list' && (
                        <button className="btn btn--primary" onClick={() => setView('add')}>
                            + Agregar Asignación
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
                                    <th>ID Viaje</th>
                                    <th>ID Despachador</th>
                                    <th>ID Conductor</th>
                                    <th>Checklist</th>
                                    <th>Asignado el</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(assignment => (
                                    <tr key={assignment.id}>
                                        <td>{assignment.tripId}</td>
                                        <td>{assignment.dispatcherId}</td>
                                        <td>{assignment.driverId}</td>
                                        <td>{assignment.checkList ? 'Sí' : 'No'}</td>
                                        <td>{assignment.assignedAt}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn--view"
                                                    onClick={() => handleDetail(assignment)}
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    className="btn btn--edit"
                                                    onClick={() => handleEdit(assignment)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn--delete"
                                                    onClick={() => handleDelete(assignment.id)}
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
                            {view === 'add' ? 'Agregar Nueva Asignación' : 'Editar Asignación'}
                        </h3>
                        <div className="form">
                            <div className="form-group">
                                <label>ID del Viaje (tripId)</label>
                                <input
                                    type="number"
                                    name="tripId"
                                    value={formData.tripId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>ID del Despachador (dispatcherId)</label>
                                <input
                                    type="number"
                                    name="dispatcherId"
                                    value={formData.dispatcherId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>ID del Conductor (driverId)</label>
                                <input
                                    type="number"
                                    name="driverId"
                                    value={formData.driverId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Checklist completado (checkList)</label>
                                <input
                                    type="checkbox"
                                    name="checkList"
                                    checked={formData.checkList}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de asignación (assignedAt)</label>
                                <input
                                    type="datetime-local"
                                    name="assignedAt"
                                    value={formData.assignedAt}
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

                {view === 'detail' && selectedAssignment && (
                    <div className="detail-container">
                        <h3 className="form-title">Detalle de la Asignación</h3>
                        <div className="detail-card">
                            <div className="detail-item">
                                <span className="detail-label">ID Asignación:</span>
                                <span className="detail-value">{selectedAssignment.id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">ID Viaje (trip):</span>
                                <span className="detail-value">{selectedAssignment.tripId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">ID Conductor (driver):</span>
                                <span className="detail-value">{selectedAssignment.driverId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">ID Despachador (dispatcher):</span>
                                <span className="detail-value">{selectedAssignment.dispatcherId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Checklist:</span>
                                <span className="detail-value">
                                    {selectedAssignment.checkList ? 'Completado' : 'Pendiente'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Asignado el:</span>
                                <span className="detail-value">{selectedAssignment.assignedAt}</span>
                            </div>
                        </div>
                        <button className="btn btn--primary" onClick={() => setView('list')}>
                            Volver a la lista
                        </button>
                    </div>
                )}
            </div>
    </>
    );
}
