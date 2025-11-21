import NavBar from "./Hero";
import Header from "./Header";
import TripsSection from "./TripsSection";
import '../styles/LandingPage.css'
import Panel from "./Admin/Panel";

export default function LandingPage({onLoginClick, user, onLogout}) {
    const usStr = localStorage.getItem('user');
    const us = JSON.parse(usStr)
    // console.log(us);
    // const usTkn = JSON.parse(localStorage.getItem('token'));
    // console.log(usTkn);

    return (
        <div className="landingPage">
            <Header onLoginClick={onLoginClick} user = {us} onCloseSesionClick={onLogout}/>
            <NavBar/>
            <TripsSection onLoginClick={onLoginClick}/> 
        </div>
    );
}