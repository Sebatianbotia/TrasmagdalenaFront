
import '../styles/nav_bar.css';
export default function NavBar() {
    return (
        <div className='presentation'>    
        <h1 >Buses Intermunicipales</h1>
            <nav className='nav-bar'>
                <ul className='nav'>
                    <li className='nav__item'>
                        <a className= 'item--text' href='#'>Viajes</a>
                    </li>
                    <li className='nav__item'>
                        <a  className= 'item--text' href='holamundo.html' >Encomiendas</a>
                    </li>
                    <li className='nav__item'>
                        <a className= 'item--text' href='#'>Despachos</a>
                    </li>
                </ul>
            </nav>
        </div>
    );

}