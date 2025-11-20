import { useEffect, useState, useRef } from "react";
import React from "react";
import '../styles/FindBus.css';

function FindBus({ route, setRoute, onSearch }) {
    
    const [stops, setStops] = useState([]);
    const [originInput, setOriginInput] = useState("");
    const [destinationInput, setDestinationInput] = useState("");
    const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
    
    const originRef = useRef(null);
    const destinationRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/stop/list')
            .then(res => res.json())
            .then(data => setStops(data))
            .catch(err => console.error('Error cargando stops:', err));
    }, []);

    const filterStops = (inputValue) => {
        if (!inputValue.trim()) return [];
        return stops.filter(stop => 
            stop.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            stop.city.name.toLowerCase().includes(inputValue.toLowerCase())
        );
    };


    const handleOriginChange = (e) => {
        const value = e.target.value;
        setOriginInput(value);
        setShowOriginSuggestions(true);
    };

    const handleDestinationChange = (e) => {
        const value = e.target.value;
        setDestinationInput(value);
        setShowDestinationSuggestions(true);
    };

    const selectOrigin = (stop) => {
        setRoute(prev => ({ ...prev, origin: stop }));
        setOriginInput(`${stop.name} - ${stop.city.name}`);
        setShowOriginSuggestions(false);
    };

    const selectDestination = (stop) => {
        setRoute(prev => ({ ...prev, destination: stop }));
        setDestinationInput(`${stop.name} - ${stop.city.name}`);
        setShowDestinationSuggestions(false);
    };

    const handleDateChange = (e) => {
        setRoute(prev => ({ ...prev, date: e.target.value }));
    };


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (originRef.current && !originRef.current.contains(e.target)) {
                setShowOriginSuggestions(false);
            }
            if (destinationRef.current && !destinationRef.current.contains(e.target)) {
                setShowDestinationSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {

        if (!route.origin || !route.destination || !route.date) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        console.log('Buscando viajes con:', route);
        
        if (onSearch) {
            onSearch();
        }
        
    };

    const originSuggestions = filterStops(originInput);
    const destinationSuggestions = filterStops(destinationInput);

    return (
        <div className="findBus__section">
            <div className="section__form">
                <div className="input-wrapper" ref={originRef}>
                    <input 
                        id="Origin" 
                        className="form__input" 
                        type="text" 
                        placeholder="Origen"
                        value={originInput}
                        onChange={handleOriginChange}
                        onFocus={() => setShowOriginSuggestions(true)}
                        autoComplete="off"
                    />
                    {showOriginSuggestions && originSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {originSuggestions.map(stop => (
                                <li 
                                    key={stop.id} 
                                    onClick={() => selectOrigin(stop)}
                                    className="suggestion-item"
                                >
                                    <strong>{stop.name}</strong>
                                    <span className="city-name"> - {stop.city.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <span className="findBus__arrow" aria-hidden="true">→</span>

                <div className="input-wrapper" ref={destinationRef}>
                    <input 
                        id="Destination" 
                        className="form__input" 
                        type="text" 
                        placeholder="Destino"
                        value={destinationInput}
                        onChange={handleDestinationChange}
                        onFocus={() => setShowDestinationSuggestions(true)}
                        autoComplete="off"
                    />
                    {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {destinationSuggestions.map(stop => (
                                <li 
                                    key={stop.id} 
                                    onClick={() => selectDestination(stop)}
                                    className="suggestion-item"
                                >
                                    <strong>{stop.name}</strong>
                                    <span className="city-name"> - {stop.city.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <input 
                    id="Date" 
                    className="form__input" 
                    type="date" 
                    placeholder="Fecha"
                    onChange={handleDateChange}
                    value={route.date}
                />
                
                <button 
                    type="button" 
                    id="Buscar" 
                    className="buscarBus"
                    onClick={handleSearch}
                >
                    Buscar
                </button>
            </div>
        </div>
    );
}

export default FindBus;