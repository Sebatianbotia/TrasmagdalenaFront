import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminConductores() {
    const [drivers, setDrivers] = useState([
        {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            phone: '3001234567',
            rol: 'DRIVER',
            driverAssignments: [],
            dispatcherAssignments: []
        },
        {
            id: 2,
            name: 'María Gómez',
            email: 'maria.gomez@example.com',
            phone: '3009876543',
            rol: 'DRIVER',
            driverAssignments: [],
            dispatcherAssignments: []
        }
    ]);

    const [view, setView] = useState('list');

    const [selectedDriver, setSelectedDriver] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        passwordHash: '',
        rol: 'DRIVER'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAdd = () => {
        setDrivers([
            ...drivers,
            {
                id: drivers.length + 1,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                passwordHash: formData.passwordHash,
                rol: 'DRIVER',
                driverAssignments: [],
                dispatcherAssignments: []
            }
        ]);
        setFormData({
            name: '',
            email: '',
            phone: '',
            passwordHash: '',
            rol: 'DRIVER'
        });
        setView('list');
    };

    const handleEdit = (driver) => {
        setSelectedDriver(driver);
        setFormData({
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
            passwordHash: '', // opcional, según cómo manejes update de contraseña
            rol: driver.rol
        });
        setView('edit');
    };

    const handleUpdate = () => {
        setDrivers(
            drivers.map(d =>
                d.id === selectedDriver.id
                    ? {
                        ...selectedDriver,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        rol: 'DRIVER',
                        // si passwordHash está vacío no lo cambias; eso ya será lógica de backend
                        ...(formData.passwordHash
                            ? { passwordHash: formData.passwordHash }
                            : {})
                    }
                    : d
            )
        );
        setFormData({
            name: '',
            email: '',
            phone: '',
            passwordHash: '',
            rol: 'DRIVER'
        });
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este conductor?')) {
            setDrivers(drivers.filter(d => d.id !== id));
        }
    };

    const handleDetail = (driver) => {
        setSelectedDriver(driver);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Conductores</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Conductor
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
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map(driver => (
                                <tr key={driver.id}>
                                    <td>{driver.name}</td>
                                    <td>{driver.email}</td>
                                    <td>{driver.phone}</td>
                                    <td>{driver.rol}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(driver)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(driver)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(driver.id)}
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
                        {view === 'add' ? 'Agregar Nuevo Conductor' : 'Editar Conductor'}
                    </h3>
                    <div className="form">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol</label>
                            <input
                                type="text"
                                name="rol"
                                value={formData.rol}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña (passwordHash)</label>
                            <input
                                type="password"
                                name="passwordHash"
                                value={formData.passwordHash}
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

            {view === 'detail' && selectedDriver && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Conductor</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedDriver.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{selectedDriver.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{selectedDriver.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Teléfono:</span>
                            <span className="detail-value">{selectedDriver.phone}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Rol:</span>
                            <span className="detail-value">{selectedDriver.rol}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Asignaciones como conductor:</span>
                            <span className="detail-value">
                                {selectedDriver.driverAssignments
                                    ? selectedDriver.driverAssignments.length
                                    : 0}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Asignaciones como despachador:</span>
                            <span className="detail-value">
                                {selectedDriver.dispatcherAssignments
                                    ? selectedDriver.dispatcherAssignments.length
                                    : 0}
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
