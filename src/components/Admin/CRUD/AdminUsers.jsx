import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Carlos López',
            email: 'carlos.lopez@example.com',
            phone: '3001112233',
            rol: 'PASSENGER'
        },
        {
            id: 2,
            name: 'Ana Martínez',
            email: 'ana.martinez@example.com',
            phone: '3004445566',
            rol: 'PASSENGER'
        }
    ]);

    const [view, setView] = useState('list');
    const [selectedUser, setSelectedUser] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        passwordHash: '',
        rol: 'PASSENGER'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdd = () => {
        setUsers(prev => [
            ...prev,
            {
                id: prev.length + 1,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                passwordHash: formData.passwordHash,
                rol: 'PASSENGER'
            }
        ]);

        setFormData({
            name: '',
            email: '',
            phone: '',
            passwordHash: '',
            rol: 'PASSENGER'
        });
        setView('list');
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            passwordHash: '',
            rol: user.rol
        });
        setView('edit');
    };

    const handleUpdate = () => {
        setUsers(prev =>
            prev.map(u =>
                u.id === selectedUser.id
                    ? {
                        ...u,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        rol: 'PASSENGER',
                        ...(formData.passwordHash
                            ? { passwordHash: formData.passwordHash }
                            : {})
                    }
                    : u
            )
        );

        setFormData({
            name: '',
            email: '',
            phone: '',
            passwordHash: '',
            rol: 'PASSENGER'
        });
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este usuario?')) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const handleDetail = (user) => {
        setSelectedUser(user);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Usuarios (Pasajeros)</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Usuario
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
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.rol}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(user)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(user.id)}
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
                        {view === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario'}
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

            {view === 'detail' && selectedUser && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Usuario</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedUser.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{selectedUser.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{selectedUser.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Teléfono:</span>
                            <span className="detail-value">{selectedUser.phone}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Rol:</span>
                            <span className="detail-value">{selectedUser.rol}</span>
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
