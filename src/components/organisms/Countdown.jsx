import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";

const Countdown = ({ eventDate, eventName }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(eventDate) - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutos: Math.floor((difference / 1000 / 60) % 60),
                segundos: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [eventDate]);

    return (
        <div className="countdown-container bg-dark text-white p-3 rounded">
            <h4>{eventName}</h4>
            {timeLeft.dias !== undefined ?
                <>
                    <p>
                        ⏳ {timeLeft.dias}d {timeLeft.horas}h {timeLeft.minutos}m {timeLeft.segundos}s
                    </p>
                    <Button text="Marcar data" className="nav-btn" onClick={() => alert("Lembrete adicionado!")} />
                </>
                : (
                    <p>Evento já começou!</p>
                )}
        </div>
    );
};

export default Countdown;
