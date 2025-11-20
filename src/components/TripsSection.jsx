import React, { useState} from "react";
import TripCard from "./TripCard";
import '../styles/TripSection.css';
import FindBus from "./FindBus";
import axios from 'axios';

function TripsSection() {
     const [route, setRoute] = useState({
        origin: null,
        destination: null,
        date: ""
    });
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


const loadTrips = async () => {
    if (!route.origin || !route.destination || !route.date) {
        setError('Por favor completa todos los campos');
        return;
    }

    try {
        setLoading(true);
        setError(null);
        
        console.log('Haciendo petición a la api');
        
        const response = await axios.get(
            `http://localhost:8080/api/v1/trip/find?origin=${route.origin.id}&destination=${route.destination.id}&date=${route.date}&userRols=PASSENGER&page=0&size=10`
        );
        console.log('Respuesta completa:', response.data);
        
        const content = response.data.content;
        
        if (!content || content.length === 0) {
            setError('No se encontraron viajes para la ruta y fecha seleccionadas');
            setTrips([]);
            return;
        }

        const tripsData = content.map(item => {
            return {
                id: item.trip.id,
                origin: item.trip.origin,
                destination: item.trip.destination,
                departTime: item.trip.departTime,
                arriveTime: item.trip.arriveTime,
                date: item.trip.date,
                price: item.trip.price,
                status: item.trip.status,
                bus: item.trip.busPlate,
                seatsAvailable: item.seatAvailable
            };
        });
        
        setTrips(tripsData);
        
    } catch (err) {
        console.error('Error en la petición:', err);
        console.error('Error response:', err.response);
        setError('No se pudieron cargar los viajes');
        setTrips([]);
    } finally {
        setLoading(false);
    }
};

        const tripsArray = [
        {
            id: 1,
            origin: "Madrid",
            destination: "Barcelona",
            departTime: "08:30:00",
            arriveTime: "14:15:00",
            date: "15/12/2023",
            price: 45.50,
            status: "scheduled",
            bus: "ABC-1234",
            seatsAvailable: 25
        },
        {
            id: 2,
            origin: "Valencia",
            destination: "Sevilla",
            departTime: "10:00:00",
            arriveTime: "18:30:00",
            date: "15/12/2023",
            price: 65.75,
            status: "scheduled",
            bus: "DEF-5678",
            seatsAvailable: 12
        },
        {
            id: 3,
            origin: "Bilbao",
            destination: "Málaga",
            departTime: "06:45:00",
            arriveTime: "16:20:00",
            date: "16/12/2023",
            price: 78.25,
            status: "scheduled",
            bus: "GHI-9012",
            seatsAvailable: 8
        },
        {
            id: 4,
            origin: "Barcelona",
            destination: "Madrid",
            departTime: "16:20:00",
            arriveTime: "22:05:00",
            date: "15/12/2023",
            price: 42.00,
            status: "scheduled",
            bus: "JKL-3456",
            seatsAvailable: 30
        },
        {
            id: 5,
            origin: "Sevilla",
            destination: "Valencia",
            departTime: "07:15:00",
            arriveTime: "15:45:00",
            date: "16/12/2023",
            price: 58.90,
            status: "scheduled",
            bus: "MNO-7890",
            seatsAvailable: 5
        }
    ];

    

    const onSeeSeats = (tripId) => {
        alert(`Ver asientos del viaje ${tripId}`);
    };

    return (
        <div className="trip__section">
            <FindBus route={route} setRoute={setRoute} onSearch={loadTrips} />
            {trips.map((trip) => (
                <TripCard
                    key={trip.id}
                    tripId={trip.id}
                    origin={trip.origin}
                    destination={trip.destination}
                    departTime={trip.departTime}
                    arriveTime={trip.arriveTime}
                    date={trip.date}
                    price={trip.price}
                    status={trip.status}
                    bus={trip.bus}
                    seatsAvailable={trip.seatsAvailable}
                    onSeeSeats={() => onSeeSeats(trip.id)
                    
                    }
                    originId={route.origin.id}
                    destinationId={route.destination.id}
                />
            ))}
        </div>
    );
}

export default TripsSection;
