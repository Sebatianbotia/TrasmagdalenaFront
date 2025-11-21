import React, { useState } from 'react';
import '../../styles/user/seatSelector.css';
import PaymentGateway from './PaymentGateway';
import Ticket from './ticket';

function PaymentMethod({ isOpen, onClose, dataToSendForTickets, selectedSeats }) {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [generatedTickets, setGeneratedTickets] = useState([]);
    const [showTickets, setShowTickets] = useState(false);
    const usStr = localStorage.getItem('user');
    const us = JSON.parse(usStr)
    console.log("user", us);

    if (!isOpen) return null;

    const { tripInfo, seatsHold, totalPrice } = dataToSendForTickets;

    const paymentMethods = [
        {
            id: 'CASH',
            name: 'Efectivo',
            description: 'Paga al momento de abordar',
            icon: '💵'
        },
        {
            id: 'TRANSFER', 
            name: 'Transferencia',
            description: 'Paga antes de abordar',
            icon: '🏦'
        },
        {
            id: 'CARD',
            name: 'Tarjeta',
            description: 'Pago en línea seguro',
            icon: '💳'
        }
    ];
    
    const generateTickets = async (paymentMethod) => {
        console.log(tripInfo);
        try {
            const ticketsPromises = seatsHold.map(async (seatHold) => {
                const ticketRequest = {
                    tripId: tripInfo.tripId,
                    seatHoldId: seatHold.id,
                    userId: us.id,
                    originId: tripInfo.originId,
                    destinationId: tripInfo.destinationId,
                    price: tripInfo.price,
                    status: 'SOLD',
                    paymentMethod: paymentMethod
                };

                const response = await fetch('http://localhost:8080/api/v1/ticket/create', {
                    method: 'POST',
                    headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                    body: JSON.stringify(ticketRequest)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error al crear ticket: ${errorData.message}`);
                }

                return await response.json();
            });

            const tickets = await Promise.all(ticketsPromises);
            setGeneratedTickets(tickets);
            setShowTickets(true);
            
            return true;
            
        } catch (error) {
            console.error("Error generando tickets:", error);
            alert('Error al generar los tickets. Por favor intenta de nuevo.');
            return false;
        }
    };

    const handlePaymentMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
    };

    const handleContinue = async () => {
        if (!selectedMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        if (selectedMethod === 'CARD') {
            setShowPaymentGateway(true);
        } else {
            // Para efectivo y transferencia, generar tickets inmediatamente
            console.log("aaaaaaaaaa", tripInfo.us);
            console.log('Método de pago seleccionado:', selectedMethod);
            const success = await generateTickets(selectedMethod);
            
            if (success) {
                console.log('Tickets generados exitosamente:', generatedTickets);
                // No cerramos el modal aquí, mostramos los tickets
            }
        }
    };

    const handleClosePaymentGateway = () => {
        setShowPaymentGateway(false);
        onClose();
    };

    const handleCloseTickets = () => {
        setShowTickets(false);
        setGeneratedTickets([]);
        onClose();
    };

    // Si estamos mostrando tickets, mostramos el componente de tickets
    if (showTickets) {
        return (
            <div className="modal-overlay" onClick={handleCloseTickets}>
                <div className="modal-content tickets-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Tickets Generados</h2>
                        <button className="modal-close" onClick={handleCloseTickets}>×</button>
                    </div>
                    
                    <div className="tickets-container">
                        {generatedTickets.map((ticket, index) => (
                            <Ticket key={ticket.id || index} ticket={ticket} />
                        ))}
                    </div>
                    
                    <div className="modal-footer">
                        <button className="btn-confirm" onClick={handleCloseTickets}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Método de Pago</h2>
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

                    <div className="payment-summary">
                        <h3>Resumen de tu compra</h3>
                        <div className="summary-item">
                            <span>Asientos seleccionados:</span>
                            <span className="summary-value">
                                {selectedSeats.map((seatId, index) => (
                                    <span key={seatId}>
                                        {seatId}{index < selectedSeats.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span>Cantidad:</span>
                            <span className="summary-value">{selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="summary-item summary-total">
                            <span>Total a pagar:</span>
                            <span className="summary-value">
                                {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    maximumFractionDigits: 0,
                                }).format(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="payment-methods">
                        <h3>Selecciona tu método de pago</h3>
                        <div className="methods-grid">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                                    onClick={() => handlePaymentMethodSelect(method.id)}
                                >
                                    <div className="method-icon">{method.icon}</div>
                                    <div className="method-info">
                                        <h4>{method.name}</h4>
                                        <p>{method.description}</p>
                                    </div>
                                    <div className="method-radio">
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            checked={selectedMethod === method.id}
                                            onChange={() => handlePaymentMethodSelect(method.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={onClose}>
                                Cancelar
                            </button>
                            <button 
                                className="btn-confirm" 
                                onClick={handleContinue}
                                disabled={!selectedMethod}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {showPaymentGateway && (
                <PaymentGateway
                    isOpen={showPaymentGateway}
                    onClose={handleClosePaymentGateway}
                    dataToSendForTickets={dataToSendForTickets}
                    selectedSeats={selectedSeats}
                />
            )}
        </>
    );  
}

export default PaymentMethod;