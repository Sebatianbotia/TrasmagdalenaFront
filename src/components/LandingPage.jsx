import NavBar from "./Hero";
import Header from "./Header";
import TripsSection from "./TripsSection";
import '../styles/LandingPage.css'
import Panel from "./Admin/Panel";

export default function LandingPage({onLoginClick}) {
    return (
        <div className="landingPage">
            {/* <Panel/> */}
            <Header onLoginClick={onLoginClick}/>
            <NavBar/>
            <TripsSection/> 
        </div>
    );
}