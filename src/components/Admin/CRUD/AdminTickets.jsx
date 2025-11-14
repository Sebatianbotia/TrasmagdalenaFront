import { useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminTickets() {
    const [tickets, setTickets] = useState([
        {
            id: 1,
            tripId: 1001,
            seatHoldId: 501,
            userId: 10,
            originId: 1,
            destinationId: 2,
            seatHold: {
                id: 501,
                status: 'RESERVED',
                seatNumber: 12,
                type: 'STANDARD'
            },
            user: {
                name: 'Juan Pérez',
                email: 'juan.perez@example.com',
                phone: '3001234567',
                rol: 'PASSENGER'
            },
            origin: {
                id: 1,
                name: 'Terminal A',
                city: 'Ciudad A'
            },
            destination: {
                id: 2,
                name: 'Terminal B',
                city: 'Ciudad B'
            },
            price: 50000,
            status: 'ISSUED',
            paymentMethod: 'CASH',
            qrCodeUrl: 'https://example.com/qr/1'
        },
        {
            id: 2,
            tripId: 1002,
            seatHoldId: 502,
            userId: 11,
            originId: 1,
            destinationId: 3,
            seatHold: {
                id: 502,
                status: 'CONFIRMED',
                seatNumber: 5,
                type: 'PREMIUM'
            },
            user: {
                name: 'María Gómez',
                email: 'maria.gomez@example.com',
                phone: '3009876543',
                rol: 'PASSENGER'
            },
            origin: {
                id: 1,
                name: 'Terminal A',
                city: 'Ciudad A'
            },
            destination: {
                id: 3,
                name: 'Terminal C',
                city: 'Ciudad C'
            },
            price: 80000,
            status: 'PAID',
            paymentMethod: 'CARD',
            qrCodeUrl: 'https://example.com/qr/2'
        }
    ]);

    const [view, setView] = useState('list');
    const [selectedTicket, setSelectedTicket] = useState(null);

    const [formData, setFormData] = useState({
        tripId: '',
        seatHoldId: '',
        userId: '',
        originId: '',
        destinationId: '',
        price: '',
        status: '',
        paymentMethod: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            tripId: '',
            seatHoldId: '',
            userId: '',
            originId: '',
            destinationId: '',
            price: '',
            status: '',
            paymentMethod: ''
        });
    };

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        setFormData({
            tripId: ticket.tripId ?? '',
            seatHoldId: ticket.seatHoldId ?? '',
            userId: ticket.userId ?? '',
            originId: ticket.originId ?? '',
            destinationId: ticket.destinationId ?? '',
            price: ticket.price ?? '',
            status: ticket.status ?? '',
            paymentMethod: ticket.paymentMethod ?? ''
        });
        setView('edit');
    };

    const handleUpdate = () => {
        setTickets(
            tickets.map(t =>
                t.id === selectedTicket.id
                    ? {
                        ...selectedTicket,
                        tripId: formData.tripId ? Number(formData.tripId) : null,
                        seatHoldId: formData.seatHoldId ? Number(formData.seatHoldId) : null,
                        userId: formData.userId ? Number(formData.userId) : null,
                        originId: formData.originId ? Number(formData.originId) : null,
                        destinationId: formData.destinationId ? Number(formData.destinationId) : null,
                        price: formData.price ? Number(formData.price) : 0,
                        status: formData.status,
                        paymentMethod: formData.paymentMethod,
                        seatHold: {
                            ...selectedTicket.seatHold,
                            id: formData.seatHoldId ? Number(formData.seatHoldId) : null
                        },
                        origin: {
                            ...selectedTicket.origin,
                            id: formData.originId ? Number(formData.originId) : null
                        },
                        destination: {
                            ...selectedTicket.destination,
                            id: formData.destinationId ? Number(formData.destinationId) : null
                        }
                    }
                    : t
            )
        );
        resetForm();
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este ticket?')) {
            setTickets(tickets.filter(t => t.id !== id));
        }
    };

    const handleDetail = (ticket) => {
        setSelectedTicket(ticket);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Tickets</h2>
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
                                <th>ID</th>
                                <th>Pasajero</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Método de pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.user?.name}</td>
                                    <td>{ticket.origin?.name}</td>
                                    <td>{ticket.destination?.name}</td>
                                    <td>{ticket.price}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.paymentMethod}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(ticket)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(ticket)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(ticket.id)}
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

            {view === 'edit' && (
                <div className="form-container">
                    <h3 className="form-title">Editar Ticket</h3>
                    <div className="form">
                        <div className="form-group">
                            <label>ID Viaje (tripId)</label>
                            <input
                                type="number"
                                name="tripId"
                                value={formData.tripId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID SeatHold (seatHoldId)</label>
                            <input
                                type="number"
                                name="seatHoldId"
                                value={formData.seatHoldId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Usuario (userId)</label>
                            <input
                                type="number"
                                name="userId"
                                value={formData.userId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Origen (originId)</label>
                            <input
                                type="number"
                                name="originId"
                                value={formData.originId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Destino (destinationId)</label>
                            <input
                                type="number"
                                name="destinationId"
                                value={formData.destinationId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado (status)</label>
                            <input
                                type="text"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Método de pago (paymentMethod)</label>
                            <input
                                type="text"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-buttons">
                            <button
                                className="btn btn--primary"
                                onClick={handleUpdate}
                            >
                                Actualizar
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

            {view === 'detail' && selectedTicket && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle del Ticket</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID Ticket:</span>
                            <span className="detail-value">{selectedTicket.id}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Viaje (tripId):</span>
                            <span className="detail-value">{selectedTicket.tripId}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">SeatHold ID:</span>
                            <span className="detail-value">{selectedTicket.seatHoldId}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Usuario ID:</span>
                            <span className="detail-value">{selectedTicket.userId}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Pasajero:</span>
                            <span className="detail-value">
                                {selectedTicket.user?.name} ({selectedTicket.user?.email})
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Teléfono:</span>
                            <span className="detail-value">
                                {selectedTicket.user?.phone}
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Rol usuario:</span>
                            <span className="detail-value">
                                {selectedTicket.user?.rol}
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Origen:</span>
                            <span className="detail-value">
                                {selectedTicket.origin?.name} ({selectedTicket.origin?.city})
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Destino:</span>
                            <span className="detail-value">
                                {selectedTicket.destination?.name} (
                                {selectedTicket.destination?.city})
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Asiento:</span>
                            <span className="detail-value">
                                {selectedTicket.seatHold?.seatNumber} (
                                {selectedTicket.seatHold?.type})
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Estado SeatHold:</span>
                            <span className="detail-value">
                                {selectedTicket.seatHold?.status}
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Precio:</span>
                            <span className="detail-value">{selectedTicket.price}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Estado Ticket:</span>
                            <span className="detail-value">{selectedTicket.status}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Método de pago:</span>
                            <span className="detail-value">
                                {selectedTicket.paymentMethod}
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">QR:</span>
                            <span className="detail-value">
                                {selectedTicket.qrCodeUrl || 'Sin QR'}
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
