import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminStops() {
    const [stops, setStops] = useState([
        {
            id: 1,
            name: 'Terminal Principal',
            cityId: 1,
            city: { name: 'Ciudad A' },
            lat: 10.1234,
            lng: -74.1234
        },
        {
            id: 2,
            name: 'Parada Centro',
            cityId: 2,
            city: { name: 'Ciudad B' },
            lat: 11.5678,
            lng: -73.5678
        }
    ]);

    const [view, setView] = useState('list');
    const [selectedStop, setSelectedStop] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        cityId: '',
        lat: '',
        lng: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = () => {
        setStops([
            ...stops,
            {
                id: stops.length + 1,
                name: formData.name,
                cityId: Number(formData.cityId),
                city: { name: '' }, // el nombre real vendrá del backend
                lat: Number(formData.lat),
                lng: Number(formData.lng)
            }
        ]);
        setFormData({ name: '', cityId: '', lat: '', lng: '' });
        setView('list');
    };

    const handleEdit = (stop) => {
        setSelectedStop(stop);
        setFormData({
            name: stop.name,
            cityId: stop.cityId ?? '',
            lat: stop.lat,
            lng: stop.lng
        });
        setView('edit');
    };

    const handleUpdate = () => {
        setStops(
            stops.map(s =>
                s.id === selectedStop.id
                    ? {
                        ...selectedStop,
                        name: formData.name,
                        cityId: Number(formData.cityId),
                        lat: Number(formData.lat),
                        lng: Number(formData.lng)
                    }
                    : s
            )
        );
        setFormData({ name: '', cityId: '', lat: '', lng: '' });
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar esta parada?')) {
            setStops(stops.filter(s => s.id !== id));
        }
    };

    const handleDetail = (stop) => {
        setSelectedStop(stop);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Paradas</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Parada
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
                                <th>Ciudad</th>
                                <th>Latitud</th>
                                <th>Longitud</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stops.map(stop => (
                                <tr key={stop.id}>
                                    <td>{stop.name}</td>
                                    <td>{stop.city?.name}</td>
                                    <td>{stop.lat}</td>
                                    <td>{stop.lng}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(stop)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(stop)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(stop.id)}
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
                        {view === 'add' ? 'Agregar Nueva Parada' : 'Editar Parada'}
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
                            <label>ID Ciudad (cityId)</label>
                            <input
                                type="number"
                                name="cityId"
                                value={formData.cityId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Latitud (lat)</label>
                            <input
                                type="number"
                                step="0.0001"
                                name="lat"
                                value={formData.lat}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Longitud (lng)</label>
                            <input
                                type="number"
                                step="0.0001"
                                name="lng"
                                value={formData.lng}
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

            {view === 'detail' && selectedStop && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle de la Parada</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedStop.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{selectedStop.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Ciudad:</span>
                            <span className="detail-value">
                                {selectedStop.city?.name}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Latitud:</span>
                            <span className="detail-value">{selectedStop.lat}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Longitud:</span>
                            <span className="detail-value">{selectedStop.lng}</span>
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
