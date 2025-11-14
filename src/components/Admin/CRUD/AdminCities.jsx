import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminCities() {
    const [cities, setCities] = useState([
        {
            id: 1,
            name: 'Ciudad A',
            lat: 10.1234,
            lon: -74.1234,
            stops: [
                { id: 1, name: 'Parada 1', lat: 10.1235, lng: -74.1235 },
                { id: 2, name: 'Parada 2', lat: 10.1236, lng: -74.1236 }
            ]
        },
        {
            id: 2,
            name: 'Ciudad B',
            lat: 11.5678,
            lon: -73.5678,
            stops: []
        }
    ]);

    const [view, setView] = useState('list');

    const [selectedCity, setSelectedCity] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        lat: '',
        lon: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = () => {
        setCities([
            ...cities,
            {
                ...formData,
                id: cities.length + 1,
                stops: []
            }
        ]);
        setFormData({ name: '', lat: '', lon: '' });
        setView('list');
    };

    const handleEdit = (city) => {
        setSelectedCity(city);
        setFormData({
            name: city.name,
            lat: city.lat,
            lon: city.lon
        });
        setView('edit');
    };

    const handleUpdate = () => {
        setCities(
            cities.map(c =>
                c.id === selectedCity.id
                    ? { ...selectedCity, ...formData }
                    : c
            )
        );
        setFormData({ name: '', lat: '', lon: '' });
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar esta ciudad?')) {
            setCities(cities.filter(c => c.id !== id));
        }
    };

    const handleDetail = (city) => {
        setSelectedCity(city);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Ciudades</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Ciudad
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
                                <th>Latitud</th>
                                <th>Longitud</th>
                                <th># Paradas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.map(city => (
                                <tr key={city.id}>
                                    <td>{city.name}</td>
                                    <td>{city.lat}</td>
                                    <td>{city.lon}</td>
                                    <td>{city.stops ? city.stops.length : 0}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(city)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(city)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(city.id)}
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
                        {view === 'add' ? 'Agregar Nueva Ciudad' : 'Editar Ciudad'}
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
                            <label>Longitud (lon)</label>
                            <input
                                type="number"
                                step="0.0001"
                                name="lon"
                                value={formData.lon}
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

            {view === 'detail' && selectedCity && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle de la Ciudad</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedCity.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{selectedCity.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Latitud:</span>
                            <span className="detail-value">{selectedCity.lat}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Longitud:</span>
                            <span className="detail-value">{selectedCity.lon}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Paradas:</span>
                            <span className="detail-value">
                                {selectedCity.stops && selectedCity.stops.length > 0
                                    ? selectedCity.stops
                                          .map(stop => `${stop.id} - ${stop.name}`)
                                          .join(', ')
                                    : 'Sin paradas'}
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
