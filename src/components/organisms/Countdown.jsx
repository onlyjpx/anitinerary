import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedButton from "../atoms/AnimatedButton";
import { useMarkedItems } from "../../hooks/useCalendar";

const Countdown = () => {
    const [mostHypedAnime, setMostHypedAnime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const { markItem } = useMarkedItems();

    const calculateTimeLeft = (eventDate) => {
        const difference = new Date(eventDate) - new Date();
        let time = {};

        if (difference > 0) {
            time = {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutos: Math.floor((difference / 1000 / 60) % 60),
                segundos: Math.floor((difference / 1000) % 60),
                total: difference,
            };
        }

        return time;
    };

    const getColorByTime = (ms) => {
        if (ms < 1000 * 60 * 60 * 24 * 3) return "#ff4d4d"; // menos de 3 dias
        if (ms < 1000 * 60 * 60 * 24 * 7) return "#ffc107"; // menos de 7 dias
        return "#17c964"; // mais de 7 dias
    };

    useEffect(() => {
        const cached = localStorage.getItem("mostHypedAnime");
        if (cached) {
            const anime = JSON.parse(cached);
            setMostHypedAnime(anime);
        }

        fetch("https://api.jikan.moe/v4/seasons/upcoming?limit=25")
            .then((res) => res.json())
            .then((data) => {
                const upcoming = data.data
                    .filter(anime => anime.aired?.from)
                    .sort((a, b) => b.members - a.members); // mais aguardado

                if (upcoming.length > 0) {
                    const topAnime = upcoming[0];
                    setMostHypedAnime(topAnime);
                    setTimeLeft(calculateTimeLeft(topAnime.aired.from));
                }
                localStorage.setItem("mostHypedAnime", JSON.stringify(topAnime));
            });
    }, []);

    useEffect(() => {
        if (mostHypedAnime) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(mostHypedAnime.aired.from));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [mostHypedAnime]);

    if (!mostHypedAnime || !timeLeft) return null;

    const color = getColorByTime(timeLeft.total);

    return (
        <motion.div
            className="countdown-container bg-dark text-white p-4 rounded d-flex flex-column flex-md-row align-items-center gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ border: `2px solid ${color}` }}
        >
            <img
                src={mostHypedAnime.images?.jpg?.large_image_url}
                alt={mostHypedAnime.title}
                className="img-fluid rounded shadow"
                style={{ maxHeight: "250px", width: "auto", objectFit: "cover" }}
            />
            <div className="text-start">
                <h4 className="mb-3" style={{ color }}>{mostHypedAnime.title}</h4>
                {timeLeft.dias !== undefined ? (
                    <>
                        <p className="mb-2 fs-5">
                            ⏳ {timeLeft.dias}d {timeLeft.horas}h {timeLeft.minutos}m {timeLeft.segundos}s
                        </p>
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <AnimatedButton
                                initialText="Marcar no calendário"
                                markedText="Marcado!"
                                className="nav-btn"
                                onClick={() => {
                                    markItem(mostHypedAnime.mal_id)
                                }}
                            />
                        </motion.div>
                    </>
                ) : (
                    <p>O anime já estreou!</p>
                )}
            </div>
        </motion.div>
    );
};

export default Countdown;
