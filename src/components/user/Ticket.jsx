import React from 'react';
import '../../styles/user/ticket.css';

function Ticket({ ticket }) {
    if (!ticket) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleDownload = () => {
        // Crear una ventana nueva para imprimir/descargar
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket - TransMagdalena</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px;
                        max-width: 400px;
                    }
                    .ticket { 
                        border: 2px solid #333; 
                        padding: 20px; 
                        border-radius: 10px;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 20px;
                    }
                    .route { 
                        font-size: 18px; 
                        font-weight: bold; 
                        margin: 10px 0;
                    }
                    .details { 
                        margin: 10px 0; 
                    }
                    .qr-code { 
                        text-align: center; 
                        margin: 15px 0;
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 15px;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <h2>TransMagdalena</h2>
                        <p>Ticket #${ticket.id}</p>
                    </div>
                    <div class="route">
                        ${ticket.origin.name} → ${ticket.destination.name}
                    </div>
                    <div class="details">
                        <p><strong>Pasajero:</strong> ${ticket.user.name}</p>
                        <p><strong>Asiento:</strong> ${ticket.seatHold.seatNumber} (${ticket.seatHold.type})</p>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
                        <p><strong>Precio:</strong> ${formatCurrency(ticket.price)}</p>
                        <p><strong>Estado:</strong> ${ticket.status}</p>
                        <p><strong>Método de pago:</strong> ${ticket.paymentMethod}</p>
                    </div>
                    <div class="qr-code">
                        <img src="${ticket.qrCodeUrl}" alt="QR Code" width="150" height="150" />
                        <p>Código QR de acceso</p>
                    </div>
                    <div class="footer">
                        <p>Gracias por viajar con TransMagdalena</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="ticket-container">
            <div className="ticket">
                <div className="ticket-header">
                    <h2>TransMagdalena</h2>
                    <span className="ticket-number">Ticket #{ticket.id}</span>
                </div>
                
                <div className="ticket-route">
                    <span className="origin">{ticket.origin.name}</span>
                    <span className="arrow">→</span>
                    <span className="destination">{ticket.destination.name}</span>
                </div>
                
                <div className="ticket-details">
                    <div className="detail-row">
                        <span className="label">Pasajero:</span>
                        <span className="value">{ticket.user.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Email:</span>
                        <span className="value">{ticket.user.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Teléfono:</span>
                        <span className="value">{ticket.user.phone}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Asiento:</span>
                        <span className="value">
                            {ticket.seatHold.seatNumber} ({ticket.seatHold.type})
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Precio:</span>
                        <span className="value price">{formatCurrency(ticket.price)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Estado:</span>
                        <span className={`status status-${ticket.status.toLowerCase()}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Método de pago:</span>
                        <span className="value">{ticket.paymentMethod}</span>
                    </div>
                </div>
                
                <div className="ticket-qr">
                    <img src={ticket.qrCodeUrl} alt="QR Code" className="qr-image" />
                    <p className="qr-label">Código QR de acceso</p>
                </div>
                
                <div className="ticket-footer">
                    <button className="download-btn" onClick={handleDownload}>
                        Descargar Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Ticket;