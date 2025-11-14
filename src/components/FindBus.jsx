import React from "react";
import '../styles/FindBus.css'

function FindBus(){
    return(
        <div className="findBus__section">
            <form className="section__form">
                <input id="Origin" className="form__input" type="text" placeholder="Origen"/>
                <span  className="findBus__arrow" aria-hidden>→</span>
                <input id="Destination" className="form__input" type="text" placeholder="Destino"/>
                <input id="Date" className="form__input" type="date" placeholder="Fecha"/>
                <button type="submit" id = "Buscar" className="buscarBus"> Buscar </button>
            </form>
            
        
        </div>
    )
}

export default FindBus