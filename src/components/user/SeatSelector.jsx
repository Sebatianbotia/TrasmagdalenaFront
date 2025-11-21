import React, { useState } from 'react';
import '../../styles/user/seatSelector.css';
import PaymentMethod from './PaymentMethod';

function SeatSelector({ isOpen, onClose, tripInfo, seats }) {

    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatsHold, setSeatsHold] = useState([]);
    const [dataForTickets, setDataForTk]= useState({});

    const usStr = localStorage.getItem('user');
    const us = JSON.parse(usStr)
    console.log("user", us);

    if (!isOpen) return null;

    const rows = Math.ceil(seats.length / 4);
    const seatMatrix = [];
    
    for (let i = 0; i < rows; i++) {
        seatMatrix.push(seats.slice(i * 4, (i + 1) * 4));
    }

    const makeSeatHold = async (seatId) => {
        try {
            const seatHoldData = {
                userId: us.id,
                tripId: tripInfo.tripId,
                seatId: seatId
            };

            console.log(seatHoldData);

            const response = await fetch(`http://localhost:8080/api/v1/seatHold/create`, {
                method: 'POST',
                headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(seatHoldData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al crear seatHold:", errorData);
                alert('Error al reservar el asiento. Por favor intenta de nuevo.');
                return false;
            }

            const data = await response.json();
            console.log("SeatHold creado exitosamente:", data);
            setSeatsHold(prev => [...prev, data]);

            return true;

        } catch (error) {
            console.error("Error de red:", error);
            alert('Inicie sesion para poder comprar.');
            return false;
        }
    };

    const toggleSeat = async (seatId, isAvailable) => {
        if (!isAvailable) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            const holdCreated = await makeSeatHold(seatId);
            
            if (holdCreated) {
                setSelectedSeats([...selectedSeats, seatId]);
            }
        }
    };

    const getSeatClass = (seat) => {
        if (selectedSeats.includes(seat.id)) return 'seat--selected';
        if (!seat.available) return 'seat--occupied';
        return 'seat--available';
    };

    const handleConfirm = () => {
        if (selectedSeats.length === 0) {
            alert('Por favor selecciona al menos un asiento');
            return;
        }

        const dataToSendForTickets = {
            tripInfo,
            seatsHold,
            totalPrice,
        };

        setDataForTk(dataToSendForTickets);

        console.log('Data para tickets:', dataToSendForTickets);
        console.log('Asientos seleccionados:', selectedSeats);
        setShowPaymentMethod(true);
        
    };

    const handleClosePaymentMethod = () => {
        setShowPaymentMethod(false);
        onClose();
    };

    const totalPrice = selectedSeats.length * (tripInfo?.price || 0);

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Selecciona tus asientos</h2>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>

                    <div className="trip-info">
                        <div className="trip-info__route">
                            <span>{tripInfo?.origin}</span>
                            <span className="arrow">→</span>
                            <span>{tripInfo?.destination}</span>
                        </div>
                        <div className="trip-info__details">
                            <span>{tripInfo?.date}</span>
                            <span>•</span>
                            <span>{tripInfo?.departTime}</span>
                        </div>
                    </div>

                    <div className="seat-legend">
                        <div className="legend-item">
                            <div className="seat-icon seat--available"></div>
                            <span>Disponible</span>
                        </div>
                        <div className="legend-item">
                            <div className="seat-icon seat--selected"></div>
                            <span>Seleccionado</span>
                        </div>
                        <div className="legend-item">
                            <div className="seat-icon seat--occupied"></div>
                            <span>Ocupado</span>
                        </div>
                    </div>

                    <div className="bus-layout">
                        <div className="bus-driver">
                            <div className="steering-wheel">🚌</div>
                        </div>

                        <div className="seats-grid">
                            {seatMatrix.map((row, rowIndex) => (
                                <div key={rowIndex} className="seat-row">
                                    <div className="seat-group">
                                        {row.slice(0, 2).map((seat) => (
                                            <button
                                                key={seat.id}
                                                className={`seat ${getSeatClass(seat)}`}
                                                onClick={() => {
                                                    toggleSeat(seat.id, seat.available);
                                                }}
                                                disabled={!seat.available}
                                                title={`Asiento ${seat.number} - ${seat.available ? 'Disponible' : 'Ocupado'}`}
                                            >
                                                {seat.number}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="aisle"></div>

                                    <div className="seat-group">
                                        {row.slice(2, 4).map((seat) => (
                                            <button
                                                key={seat.id}
                                                className={`seat ${getSeatClass(seat)}`}
                                                onClick={() => toggleSeat(seat.id, seat.available)}
                                                disabled={!seat.available}
                                                title={`Asiento ${seat.number} - ${seat.available ? 'Disponible' : 'Ocupado'}`}
                                            >
                                                {seat.number}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <div className="selection-summary">
                            <span className="selected-count">
                                {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''} seleccionado{selectedSeats.length !== 1 ? 's' : ''}
                            </span>
                            {selectedSeats.length > 0 && (
                                <span className="total-price">
                                    Total: {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                        maximumFractionDigits: 0,
                                    }).format(totalPrice)}
                                </span>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={onClose}>
                                Cancelar
                            </button>
                            <button 
                                className="btn-confirm" 
                                onClick={handleConfirm}
                                disabled={selectedSeats.length === 0}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showPaymentMethod && (<PaymentMethod
                isOpen={showPaymentMethod}
                onClose={handleClosePaymentMethod}
                dataToSendForTickets={dataForTickets}
                selectedSeats={selectedSeats}
            />)}
            
        </>
    );
}

export default SeatSelector;