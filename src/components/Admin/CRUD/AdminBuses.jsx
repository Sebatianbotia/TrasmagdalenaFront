import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';


export default function AdminBuses() {
    const [buses, setBuses] = useState([
        { id: 1, placa: 'ABC123', modelo: 'Mercedes Benz', capacidad: '45', estado: 'Activo' },
        { id: 2, placa: 'DEF456', modelo: 'Volvo', capacidad: '50', estado: 'Activo' }
    ]);
    const [view, setView] = useState('list');

    const [selectedBus, setSelectedBus] = useState(null);
    
    const [formData, setFormData] = useState({
        placa: '',
        modelo: '',
        capacidad: '',
        estado: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = () => {
        setBuses([...buses, { ...formData, id: buses.length + 1 }]);
        setFormData({ placa: '', modelo: '', capacidad: '', estado: '' });
        setView('list');
    };

    const handleEdit = (bus) => {
        setSelectedBus(bus);
        setFormData(bus);
        setView('edit');
    };

    const handleUpdate = () => {
        setBuses(buses.map(b => b.id === selectedBus.id ? { ...formData, id: selectedBus.id } : b));
        setFormData({ placa: '', modelo: '', capacidad: '', estado: '' });
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este bus?')) {
            setBuses(buses.filter(b => b.id !== id));
        }
    };

    const handleDetail = (bus) => {
        setSelectedBus(bus);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Buses</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Bus
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
                                <th>Placa</th>
                                <th>Modelo</th>
                                <th>Capacidad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map(bus => (
                                <tr key={bus.id}>
                                    <td>{bus.placa}</td>
                                    <td>{bus.modelo}</td>
                                    <td>{bus.capacidad}</td>
                                    <td>{bus.estado}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn btn--view" onClick={() => handleDetail(bus)}>Ver</button>
                                            <button className="btn btn--edit" onClick={() => handleEdit(bus)}>Editar</button>
                                            <button className="btn btn--delete" onClick={() => handleDelete(bus.id)}>Eliminar</button>
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
                    <h3 className="form-title">{view === 'add' ? 'Agregar Nuevo Bus' : 'Editar Bus'}</h3>
                    <div className="form">
                        <div className="form-group">
                            <label>Placa</label>
                            <input
                                type="text"
                                name="placa"
                                value={formData.placa}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Modelo</label>
                            <input
                                type="text"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacidad</label>
                            <input
                                type="number"
                                name="capacidad"
                                value={formData.capacidad}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <input
                                type="text"
                                name="estado"
                                value={formData.estado}
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
                            <button className="btn btn--secondary" onClick={() => setView('list')}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'detail' && selectedBus && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Bus</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">Placa:</span>
                            <span className="detail-value">{selectedBus.placa}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Modelo:</span>
                            <span className="detail-value">{selectedBus.modelo}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Capacidad:</span>
                            <span className="detail-value">{selectedBus.capacidad}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Estado:</span>
                            <span className="detail-value">{selectedBus.estado}</span>
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