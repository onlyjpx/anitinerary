import React from "react";
import AnimatedButton from "../atoms/AnimatedButton";

const CalendarPreview = () => {
    return (
        <section className="text-white">
            <h2 className="text-2xl font-bold mb-3">📅 Seu Calendário de Lançamentos</h2>
            <p className="mb-4">Acompanhe os animes que você marcou e nunca perca um episódio!</p>
            <AnimatedButton
                initialText="Ver Calendário"
                markedText="Redirecionando..."
                className="nav-btn border b-white"
                onClick={() => window.location.href = "/calendar"}
            />
        </section>
    );
};

export default CalendarPreview;
