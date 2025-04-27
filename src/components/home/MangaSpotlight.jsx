import React, { useEffect, useState } from "react";

const MangaSpotlight = () => {
    const [mangas, setMangas] = useState([]);

    useEffect(() => {
        const cached = localStorage.getItem("mangas");
        if (cached) {
            setMangas(JSON.parse(cached));
            return;
        }
        fetch("https://api.jikan.moe/v4/top/manga?limit=6")
            .then(res => res.json())
            .then(data => {
                setMangas(data.data),
                    localStorage.setItem("mangas", JSON.stringify(data.data))
            })
            .catch(err => console.error("Erro ao buscar mangás em destaque:", err));
    }, []);

    return (
        <section className="text-white">
            <h2 className="text-2xl font-bold mb-4">📚 Mangás em Destaque</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mangas?.length > 0 ? (
                    mangas.map((manga) => (
                        <div key={manga.mal_id}>
                            <h5>{manga.title}</h5>
                        </div>
                    ))
                ) : (
                    <p className="text-light">Carregando mangás em destaque...</p>
                )}

            </div>
        </section>
    );
};

export default MangaSpotlight;