import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
import '../styles/TripSection.css';
import FindBus from "./FindBus";
import axios from 'axios';

function TripsSection() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Haciendo petición a la api');
            
            const response = await axios.get('http://localhost:8080/api/v1/trip/2/freeSeats');
            
            
            const tripData = {
                id: response.data.trip.id,
                origin: response.data.trip.origin,
                destination: response.data.trip.destination,
                departTime: new Date(response.data.trip.departTime).toLocaleTimeString(),
                arriveTime: new Date(response.data.trip.arriveTime).toLocaleTimeString(),
                date: new Date(response.data.trip.date).toLocaleDateString(),
                price: response.data.trip.price,
                status: response.data.trip.status,
                bus: response.data.trip.busPlate,
                seatsAvailable: response.data.seatAvailable
            };
            
            setTrips([tripData]);
    
            
        } catch (err) {
            console.error('error:', err);
        
            setError('Error al cargar los viajes');
        } finally {
            setLoading(false);
        }
    };

    const onSeeSeats = (tripId) => {
        alert(`Ver asientos del viaje ${tripId}`);
    };

    return (
        <div className="trip__section">
            <FindBus />
            {trips.map((trip) => (
                <TripCard
                    key={trip.id}
                    origin={trip.origin}
                    destination={trip.destination}
                    departTime={trip.departTime}
                    arriveTime={trip.arriveTime}
                    date={trip.date}
                    price={trip.price}
                    status={trip.status}
                    bus={trip.bus}
                    seatsAvailable={trip.seatsAvailable}
                    onSeeSeats={() => onSeeSeats(trip.id)}
                />
            ))}
        </div>
    );
}

export default TripsSection;
