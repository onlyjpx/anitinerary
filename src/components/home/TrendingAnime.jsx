import React, { useEffect, useState } from "react";

const TrendingAnime = () => {
    const [animes, setAnimes] = useState([]);

    useEffect(() => {
        const cached = localStorage.setItem("animes");
        if (cached) {
            setAnimes(JSON.parse(cached));
            return;
        }
        fetch("https://api.jikan.moe/v4/top/anime?limit=6")
            .then(res => res.json())
            .then(data => {
                setAnimes(data.data),
                    localStorage.setItem("animes", JSON.stringify(data.data))
            })
            .catch(err => console.error("Erro ao buscar animes em alta:", err));
    }, []);

    return (
        <section className="text-white">
            <h2 className="text-2xl font-bold mb-4">🔥 Em Alta na Temporada</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {animes?.length > 0 ? (
                    animes.map(anime => (
                        <div key={anime.mal_id} className="bg-dark rounded p-2 shadow">
                            <img src={anime.images.jpg.image_url} alt={anime.title} className="rounded h-48 w-full object-cover" />
                            <h3 className="mt-2 text-lg font-semibold">{anime.title}</h3>
                        </div>
                    ))
                ) : (
                    <p className="text-light">Carregando animes em alta...</p>
                )}
            </div>
        </section>
    );
};

export default TrendingAnime;