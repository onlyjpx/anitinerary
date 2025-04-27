import React, { useEffect, useState } from "react";
import Countdown from "../organisms/Countdown";

const NextBigRelease = () => {
    const [nextAnime, setNextAnime] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem("nextAnime");
        if (cached) {
            setNextAnime(JSON.parse(cached));
            return;
        }
        fetch("https://api.jikan.moe/v4/seasons/upcoming?limit=20")
            .then(res => res.json())
            .then(data => {
                const filtered = data.data?.filter(a => a.aired?.from);
                const sorted = filtered.sort((a, b) => new Date(a.aired.from) - new Date(b.aired.from));
                setNextAnime(sorted[0]);
                localStorage.setItem("nextAnime", JSON.stringify(sorted[0]));
            })
            .catch(err => console.error("Erro ao buscar próximo lançamento:", err));
    }, []);

    return (
        <>
            {nextAnime ? (
                <Countdown
                    eventDate={nextAnime.aired.from}
                    eventName={nextAnime.title}
                    image={nextAnime.images?.jpg?.image_url}
                />
            ) : (
                <p className="text-light">Carregando próximo grande lançamento...</p>
            )}
        </>
    );
};

export default NextBigRelease;
