import InformationCard from "../informationCard"
import "../../../styles/Admin/CRUD/dashboard.css"

export default function Dashboard(){



    return (
        <>
            <h3>Resumen General</h3>
            <div className="information__div">
                <InformationCard cardTittle = "Total buses" number = "74"/>
                <InformationCard cardTittle = "Rutas Activas" number = "89"/>
                <InformationCard cardTittle = "Conductores Registrados" number = "100"/>
                <InformationCard cardTittle = "Usuarios Registrados" number = "923"/>
                <InformationCard cardTittle = "Despachadores Registrados" number = "21"/>
                <InformationCard cardTittle = "Total generado este mes" number = "12.000.000"/>
            </div>
        </>
    )
}