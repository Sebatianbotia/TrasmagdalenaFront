import React, { useState } from 'react';
import '../../styles/user/seatSelector.css';
import Ticket from './ticket';

function PaymentGateway({ isOpen, onClose, dataToSendForTickets, selectedSeats }) {
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    const us = JSON.parse(localStorage.getItem('user'));

    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedTickets, setGeneratedTickets] = useState([]);
    const [showTickets, setShowTickets] = useState(false);

    if (!isOpen) return null;

    const { tripInfo, seatsHold } = dataToSendForTickets;
    const totalPrice = selectedSeats.length * (tripInfo?.price || 0);

    const generateTickets = async (paymentMethod) => {
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
                        'Content-Type': 'application/json'
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardData({
            ...cardData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
            alert('Por favor completa todos los campos');
            return;
        }

        setIsProcessing(true);

        try {
            console.log('Procesando pago con tarjeta:', cardData);
            console.log('Data para tickets:', dataToSendForTickets);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const success = await generateTickets('CARD');
            
            if (success) {
                console.log('Tickets generados exitosamente:', generatedTickets);
            }
            
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago. Por favor intenta de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseTickets = () => {
        setShowTickets(false);
        setGeneratedTickets([]);
        onClose();
    };

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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Pasarela de Pagos</h2>
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

                <div className="payment-amount">
                    <h3>Total a pagar</h3>
                    <div className="amount">
                        {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            maximumFractionDigits: 0,
                        }).format(totalPrice)}
                    </div>
                </div>

                <form className="payment-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="cardNumber">Número de tarjeta</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            value={cardData.cardNumber}
                            onChange={handleInputChange}
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cardName">Nombre del titular</label>
                        <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            placeholder="Como aparece en la tarjeta"
                            value={cardData.cardName}
                            onChange={handleInputChange}
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiryDate">Fecha de vencimiento</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="MM/AA"
                                maxLength="5"
                                value={cardData.expiryDate}
                                onChange={handleInputChange}
                                disabled={isProcessing}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                maxLength="4"
                                value={cardData.cvv}
                                onChange={handleInputChange}
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

                    <div className="security-notice">
                        <span className="security-icon">🔒</span>
                        <p>Tus datos están protegidos con encriptación SSL</p>
                    </div>

                    <div className="modal-footer">
                        <div className="modal-actions">
                            <button 
                                type="button"
                                className="btn-cancel" 
                                onClick={onClose}
                                disabled={isProcessing}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="btn-confirm" 
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Procesando...' : 'Pagar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PaymentGateway;