import React from "react";
import Button from "./atoms/Button";

const EventCard = ({ title, date, location, onAddToCalendar }) => {
    return (
        <div className="card p-3 mb-3">
            <h5>{title}</h5>
            <p>{date} - {location}</p>
            <Button text="Adicionar ao Calendário" onClick={onAddToCalendar} className="btn-success" />
        </div>
    );
};

export default EventCard;
