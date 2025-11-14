import "../../styles/Admin/card.css"

export default function InformationCard({cardTittle, number}){
    return (
        <>
            <div className="information__card">
                <p className="card__tittle">{cardTittle}</p>
                <p className="card__total">{number}</p>
            </div>
        </>
    )
}