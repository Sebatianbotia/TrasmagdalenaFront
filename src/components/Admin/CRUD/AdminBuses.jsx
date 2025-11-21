import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminBuses() {
    const [buses, setBuses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedBus, setSelectedBus] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const [formData, setFormData] = useState({
        plate: '',
        capacity: '',
        status: 'ACTIVE',
        seats: []
    });

    const [seatForm, setSeatForm] = useState({
        number: '',
        type: 'NORMAL'
    });

    useEffect(() => {
        fetchBuses();
    }, [currentPage]);

    const fetchBuses = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/bus/all?page=${currentPage}&size=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar los buses');
            }

            const data = await response.json();
            setBuses(data.content);
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

    const handleSeatInputChange = (e) => {
        setSeatForm({
            ...seatForm,
            [e.target.name]: e.target.value
        });
    };

    const addSeat = () => {
        if (seatForm.number && seatForm.type) {
            setFormData({
                ...formData,
                seats: [...formData.seats, {
                    number: parseInt(seatForm.number),
                    type: seatForm.type
                }]
            });
            setSeatForm({ number: '', type: 'NORMAL' });
        }
    };

    const removeSeat = (index) => {
        const updatedSeats = formData.seats.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            seats: updatedSeats
        });
    };

    const handleAdd = async () => {
        try {
            const busData = {
                plate: formData.plate,
                capacity: parseInt(formData.capacity),
                status: formData.status,
                seats: formData.seats
            };

            const response = await fetch('http://localhost:8080/api/v1/bus/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(busData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Datos no válidos");
            }

            const data = await response.json();
            setBuses([...buses, data]);
            
            setFormData({
                plate: '',
                capacity: '',
                status: 'ACTIVE',
                seats: []
            });
            setView('list');
            fetchBuses();

        } catch (error) {
            console.error('Error al crear el bus:', error);
            alert('Error: ' + error.message);
        }
    };

    const handleEdit = (bus) => {
        setSelectedBus(bus);
        setFormData({
            plate: bus.plate,
            capacity: bus.capacity.toString(),
            status: bus.status,
            seats: bus.seats || []
        });
        setView('edit');
    };

    const handleUpdate = async () => {
        try {
            const busData = {
                id: selectedBus.id,
                plate: formData.plate,
                capacity: parseInt(formData.capacity),
                status: formData.status
            };

            const response = await fetch(`http://localhost:8080/api/v1/bus/update/${selectedBus.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(busData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar");
            }

            setFormData({
                plate: '',
                capacity: '',
                status: 'ACTIVE',
                seats: []
            });
            fetchBuses();
            setView('list');
        } catch (error) {
            console.error('Error:', error.message);
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este bus?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/bus/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error("No se pudo eliminar el bus");
                }

                fetchBuses();
            } catch (error) {
                console.error('Error: ' + error.message);
                alert('Error: ' + error.message);
            }
        }
    };

    const handleDetail = (bus) => {
        setSelectedBus(bus);
        setView('detail');
    };

    const getStatusText = (status) => {
        const statusMap = {
            'ACTIVE': 'Activo',
            'MAINTENANCE': 'Mantenimiento',
            'INACTIVE': 'Inactivo'
        };
        return statusMap[status] || status;
    };

    const getSeatTypeText = (type) => {
        const typeMap = {
            'NORMAL': 'Normal',
            'PREMIUM': 'Premium'
        };
        return typeMap[type] || type;
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
                                <th>Capacidad</th>
                                <th>Estado</th>
                                <th># Asientos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map(bus => (
                                <tr key={bus.id}>
                                    <td>{bus.plate}</td>
                                    <td>{bus.capacity}</td>
                                    <td>{getStatusText(bus.status)}</td>
                                    <td>{bus.seats ? bus.seats.length : 0}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(bus)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(bus)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(bus.id)}
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
                        {view === 'add' ? 'Agregar Nuevo Bus' : 'Editar Bus'}
                    </h3>
                    <div className="form">
                        <div className="form-group">
                            <label>Placa</label>
                            <input
                                type="text"
                                name="plate"
                                value={formData.plate}
                                onChange={handleInputChange}
                                placeholder="Ej: ABC123"
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacidad</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                placeholder="Ej: 45"
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="ACTIVE">Activo</option>
                                <option value="MAINTENANCE">Mantenimiento</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>
                        </div>

                        {view === 'add' && (
                            <>
                                <div className="form-section">
                                    <h4>Asientos</h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Número</label>
                                            <input
                                                type="number"
                                                name="number"
                                                value={seatForm.number}
                                                onChange={handleSeatInputChange}
                                                placeholder="Número de asiento"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tipo</label>
                                            <select
                                                name="type"
                                                value={seatForm.type}
                                                onChange={handleSeatInputChange}
                                            >
                                                <option value="NORMAL">Normal</option>
                                                <option value="PREMIUM">Premium</option>
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn--primary"
                                            onClick={addSeat}
                                            style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}
                                        >
                                            Agregar Asiento
                                        </button>
                                    </div>
                                </div>

                                {formData.seats.length > 0 && (
                                    <div className="seats-list">
                                        <h5>Asientos agregados:</h5>
                                        {formData.seats.map((seat, index) => (
                                            <div key={index} className="seat-item">
                                                <span>Asiento {seat.number} - {getSeatTypeText(seat.type)}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn--delete btn--small"
                                                    onClick={() => removeSeat(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

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

            {view === 'detail' && selectedBus && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Bus</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedBus.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Placa:</span>
                            <span className="detail-value">{selectedBus.plate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Capacidad:</span>
                            <span className="detail-value">{selectedBus.capacity}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Estado:</span>
                            <span className="detail-value">{getStatusText(selectedBus.status)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Asientos:</span>
                            <span className="detail-value">
                                {selectedBus.seats && selectedBus.seats.length > 0
                                    ? selectedBus.seats
                                        .map(seat => `#${seat.number} (${getSeatTypeText(seat.type)})`)
                                        .join(', ')
                                    : 'Sin asientos'}
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