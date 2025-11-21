import { useState } from "react";
import React from "react";  
import '../styles/TripCard.css';
import SeatSelector from "./user/SeatSelector";
import PaymentMethod from "./user/PaymentMethod";

export default function TripCard({
  tripId,
  origin,
  destination,
  departTime,
  arriveTime,
  date,
  price,
  status,
  bus,
  seatsAvailable,
  onSeeSeats,
  originId,
  destinationId,
  onLoginclick
}) {
  
  const [showSeatSelector, setShowSeatSelector] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [seats, setSeats] = useState([]);
  const [seatsHold, setSeatsHold] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processedSeats, setProcessedSeats] = useState([]);
  console.log(tripId);

  const money = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

  const getSeats = async () => {
    if(!localStorage.getItem('user')){
      alert("Debes iniciar sesion para ver los asientos disponibles")
      onLoginclick();
    }
    try {
      const response = await fetch(`http://localhost:8080/api/v1/trip/${tripId}/seats`, {
        method: 'GET',
        headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los asientos');
      }
      
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error al obtener asientos:", error);
      return [];
    }
  };

  const getSeatsHold = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/trip/${tripId}/seatsHold`, {
        method: 'GET',
        headers: {
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los asientos ocupados');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener asientos ocupados:", error);
      return [];
    }
  };

  const handleViewSeats = async () => {
    setLoading(true);
    
    try {
      const [seatsData, seatsHoldData] = await Promise.all([
        getSeats(),
        getSeatsHold()
      ]);
      console.log(seatsData);
      console.log(seatsHoldData);
      setSeats(seatsData);
      setSeatsHold(seatsHoldData);
      
  
      const formattedSeats = seatsData.map(seat => ({
        id: seat.id,
        number: seat.number,
        available: !seatsHoldData.includes(seat.number) 
      }));
      
      setProcessedSeats(formattedSeats);
      setShowSeatSelector(true);
      
    } catch (error) {
      console.error("error :", error);
      alert("Hubo un error ");
    } finally {
      setLoading(false);
    }
  };

  const tripInfo = {
    tripId,
    origin,
    destination,
    date,
    departTime,
    price,
    originId,
    destinationId
  };

  return (
    <>
      <article className="trip-card" role="group" aria-label="Resultado de viaje">
        <div className="trip-card__date" aria-label="Fecha">{date}</div>

        <div className="trip-card__top">
          <div className="trip-card__route">
            <div className="trip-card__line trip-card__line--places">
              <span className="trip-card__place">{origin}</span>
              <span className="trip-card__arrow" aria-hidden>→</span>
              <span className="trip-card__place">{destination}</span>
            </div>

            <div className="trip-card__line trip-card__line--times">
              <span className="trip-card__time">{departTime}</span>
              <span className="trip-card__arrow" aria-hidden>→</span>
              <span className="trip-card__time">{arriveTime}</span>
            </div>
          </div>

          <div className="trip-card__price" aria-label="Precio">{money}</div>
        </div>

        <div className="trip-card__bottom">
          <div className="trip-card__meta">
            <span className="trip-card__label">Estado:</span>{" "}
            <span className="trip-card__value">{status}</span>
          </div>

          <div className="trip-card__meta">
            <span className="trip-card__label">Bus:</span>{" "}
            <span className="trip-card__value">{bus}</span>
          </div>

          <div className="trip-card__meta">
            <strong className="trip-card__seats">{seatsAvailable}</strong>{" "}
            <span className="trip-card__label">asientos disponibles</span>
          </div>

          <button
            type="button"
            className="trip-card__cta"
            onClick={handleViewSeats}
            disabled={loading}
            aria-label="Ver asientos disponibles"
          >
            {loading ? 'Cargando...' : 'Ver asientos'}
          </button>
        </div>

        {showSeatSelector && (
          <SeatSelector 
            isOpen={showSeatSelector}
            onClose={() => setShowSeatSelector(false)}
            tripInfo={tripInfo}
            seats={processedSeats}
          />
        )}

      </article>
    </>
  );
}