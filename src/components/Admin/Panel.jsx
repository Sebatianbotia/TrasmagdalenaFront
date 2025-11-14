import "../../styles/Admin/panel.css"


export default function Panel(){
    return(
        <>
            <div className="panel">
                <aside className="options">
                    <div className="options__data">
                        <h4>Transmagdalena</h4>
                        <p>Panel de administrador</p>
                    </div>
                    <div className="options__actions">
                        <ul className="actions__list">
                            <li className="action__item">Administrar Buses</li>
                            <li className="action__item">Administrar rutas</li>
                            <li className="action__item">Administrar conductores</li>
                            <li className="action__item">Administrar usuarios</li>
                            <li className="action__item">Administrar asignaciones</li>
                            <li className="action__item">Administrar ciudades</li>
                            <li className="action__item">Administrar paradas</li>
                            <li className="action__item">Administrar incidentes</li>
                            <li className="action__item">Administrar tiquetes</li>
                            <li className="action__item">Administrar viajes</li>
                            <li className="action__item">Administrar aaaaa</li>
                        </ul>
                    </div>
                    <button className="exit__btn">Cerrar Sesion</button>
                </aside>
                <div className="panelInformation">
                    <h3>Resumen General</h3>
                    <div className="information__div">
                        <div className="information__card">
                            <p className="card__tittle">Total de buses</p>
                            <p className="card__total">85</p>
                        </div>
                        <div className="information__card">
                            <p className="card__tittle">Rutas activas</p>
                            <p className="card__total">85</p>
                        </div>
                       <div className="information__card">
                            <p className="card__tittle">Conductores registrados</p>
                            <p className="card__total">85</p>
                        </div>
                        <div className="information__card">
                            <p className="card__tittle">Usuarios Registrados</p>
                            <p className="card__total">85</p>
                        </div>
                        <div className="information__card">
                            <p className="card__tittle">Despachadores</p>
                            <p className="card__total">85</p>
                        </div>
                        <div className="information__card">
                            <p className="card__tittle">total generado este mes</p>
                            <p className="card__total">12.00.000</p>
                        </div>
                    </div>
                </div>
            </div>  
        </>

    )
}