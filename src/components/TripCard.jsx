import React from "react";  
import '../styles/TripCard.css';

export default function TripCard({
  origin,
  destination,
  departTime,
  arriveTime,
  date,
  price,
  status ,
  bus,
  seatsAvailable ,
  onSeeSeats,
}) {
  const money = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits:0,
  }).format(price);

  return (
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
          onClick={onSeeSeats}
          aria-label="Ver asientos disponibles"
        >
          Ver asientos
        </button>
      </div>
    </article>
  );
}
