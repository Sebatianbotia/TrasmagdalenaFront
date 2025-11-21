import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminDrivers() {
    const [drivers, setDrivers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedDriver, setSelectedDriver] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bornDate: '',
        rol: 'DRIVER'
    });

    useEffect(() => {
        fetchDrivers();
    }, [currentPage]);

    const fetchDrivers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/user/find/type?rol=DRIVER&page=${currentPage}&size=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los conductores');
            }

            const data = await response.json();
            setDrivers(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = async () => {
        try {
            const driverData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bornDate: formData.bornDate,
                rol: formData.rol
            };

            const response = await fetch('http://localhost:8080/api/v1/user/create', {
                method: 'POST',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(driverData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Datos no válidos");
            }

            const data = await response.json();
            setDrivers([...drivers, data]);
            
            setFormData({
                name: '',
                email: '',
                phone: '',
                bornDate: '',
                rol: 'DRIVER'
            });
            setView('list');
            fetchDrivers();

        } catch (error) {
            console.error('Error al crear el conductor:', error);
            alert('Error: ' + error.message);
        }
    };

    const handleEdit = (driver) => {
        setSelectedDriver(driver);
        setFormData({
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
            bornDate: driver.bornDate,
            rol: driver.rol
        });
        setView('edit');
    };

    const handleUpdate = async () => {
        try {
            const driverData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bornDate: formData.bornDate,
                rol: formData.rol
            };

            const response = await fetch(`http://localhost:8080/api/v1/user/update/${selectedDriver.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(driverData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar");
            }

            setFormData({
                name: '',
                email: '',
                phone: '',
                bornDate: '',
                rol: 'DRIVER'
            });
            fetchDrivers();
            setView('list');
        } catch (error) {
            console.error('Error:', error.message);
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este conductor?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/user/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type':'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error("No se pudo eliminar el conductor");
                }

                fetchDrivers();
            } catch (error) {
                console.error('Error: ' + error.message);
                alert('Error: ' + error.message);
            }
        }
    };

    const handleDetail = (driver) => {
        setSelectedDriver(driver);
        setView('detail');
    };

    const getRolText = (rol) => {
        const rolMap = {
            'PASSENGER': 'Pasajero',
            'CLERK': 'Empleado',
            'DRIVER': 'Conductor',
            'DISPATCHER': 'Despachador',
            'ADMIN': 'Administrador',
            'STUDENT': 'Estudiante',
            'OLD_MAN': 'Adulto Mayor'
        };
        return rolMap[rol] || rol;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-CO');
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
                                <th>Fecha Nacimiento</th>
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
                                    <td>{formatDate(driver.bornDate)}</td>
                                    <td>{getRolText(driver.rol)}</td>
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
                                placeholder="Nombre completo"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="3001234567"
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="bornDate"
                                value={formData.bornDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol</label>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleInputChange}
                            >
                                <option value="DRIVER">Conductor</option>
                                <option value="DISPATCHER">Despachador</option>
                                <option value="CLERK">Empleado</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
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
                            <span className="detail-label">Fecha Nacimiento:</span>
                            <span className="detail-value">{formatDate(selectedDriver.bornDate)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Rol:</span>
                            <span className="detail-value">{getRolText(selectedDriver.rol)}</span>
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