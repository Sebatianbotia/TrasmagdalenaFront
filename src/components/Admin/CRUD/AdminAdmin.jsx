import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminAdmin() {
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bornDate: '',
        rol: 'ADMIN'
    });

    useEffect(() => {
        fetchAdmins();
    }, [currentPage]);

    const fetchAdmins = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/user/find/type?rol=ADMIN&page=${currentPage}&size=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los administradores');
            }

            const data = await response.json();
            setAdmins(data.content);
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
            const adminData = {
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
                body: JSON.stringify(adminData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Datos no válidos");
            }

            const data = await response.json();
            setAdmins([...admins, data]);
            
            setFormData({
                name: '',
                email: '',
                phone: '',
                bornDate: '',
                rol: 'ADMIN'
            });
            setView('list');
            fetchAdmins();

        } catch (error) {
            console.error('Error al crear el administrador:', error);
            alert('Error: ' + error.message);
        }
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            bornDate: admin.bornDate,
            rol: admin.rol
        });
        setView('edit');
    };

    const handleUpdate = async () => {
        try {
            const adminData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bornDate: formData.bornDate,
                rol: formData.rol
            };

            const response = await fetch(`http://localhost:8080/api/v1/user/update/${selectedAdmin.id}`, {
                method: 'PATCH',
                 headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(adminData)
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
                rol: 'ADMIN'
            });
            fetchAdmins();
            setView('list');
        } catch (error) {
            console.error('Error:', error.message);
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este administrador?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/user/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                });

                if (!response.ok) {
                    throw new Error("No se pudo eliminar el administrador");
                }

                fetchAdmins();
            } catch (error) {
                console.error('Error: ' + error.message);
                alert('Error: ' + error.message);
            }
        }
    };

    const handleDetail = (admin) => {
        setSelectedAdmin(admin);
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
                <h2 className="admin-buses__title">Administrar Administradores</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Administrador
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
                            {admins.map(admin => (
                                <tr key={admin.id}>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.phone}</td>
                                    <td>{formatDate(admin.bornDate)}</td>
                                    <td>{getRolText(admin.rol)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(admin)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(admin)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(admin.id)}
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
                        {view === 'add' ? 'Agregar Nuevo Administrador' : 'Editar Administrador'}
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
                                <option value="ADMIN">Administrador</option>
                                <option value="DISPATCHER">Despachador</option>
                                <option value="CLERK">Empleado</option>
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

            {view === 'detail' && selectedAdmin && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Administrador</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedAdmin.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{selectedAdmin.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{selectedAdmin.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Teléfono:</span>
                            <span className="detail-value">{selectedAdmin.phone}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Fecha Nacimiento:</span>
                            <span className="detail-value">{formatDate(selectedAdmin.bornDate)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Rol:</span>
                            <span className="detail-value">{getRolText(selectedAdmin.rol)}</span>
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