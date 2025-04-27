import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AnimatedButton from "../components/atoms/AnimatedButton";
import { useMarkedItems } from "../hooks/useCalendar";
import "../styles.css";

const Releases = () => {
    const [animes, setAnimes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("Todos");
    const { markItem } = useMarkedItems();

    useEffect(() => {
        const cached = localStorage.getItem("seasonAnimes");
        if (cached) {
            const data = JSON.parse(cached);
            setAnimes(data);
            setFiltered(data);
            extractGenres(data);
        } else {
            axios.get("https://api.jikan.moe/v4/seasons/now?limit=24")
                .then(res => {
                    const unique = Array.from(
                        new Map(res.data.data.map(item => [item.mal_id, item])).values()
                    );
                    setAnimes(unique);
                    setFiltered(unique);
                    extractGenres(unique);
                    localStorage.setItem("seasonAnimes", JSON.stringify(unique));
                });
        }
    }, []);

    const extractGenres = (data) => {
        const allGenres = new Set();
        data.forEach(anime => {
            anime.genres.forEach(genre => allGenres.add(genre.name));
        });
        setGenres(["Todos", ...Array.from(allGenres)]);
    };

    const handleGenreFilter = (genre) => {
        setSelectedGenre(genre);
        if (genre === "Todos") {
            setFiltered(animes);
        } else {
            const filtered = animes.filter(anime =>
                anime.genres.some(g => g.name === genre)
            );
            setFiltered(filtered);
        }
    };

    return (
        <div className="container text-white py-5">
            <h2 className="text-center mb-4">🌸 Lançamentos da Temporada (Primavera)</h2>

            <div className="d-flex flex-wrap justify-content-center mb-4">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => handleGenreFilter(genre)}
                        className={`btn mx-2 mb-2 ${selectedGenre === genre ? "btn-primary" : "btn-outline-light"} `}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="row">
                {filtered.map(anime => (
                    <div key={anime.mal_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="flip-card">
                            <motion.div
                                className="flip-card-inner"
                                whileHover={{ rotateY: 180 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flip-card-front">
                                    <img
                                        src={anime.images.jpg.image_url}
                                        alt={anime.title}
                                        className="card-img-top"
                                    />
                                </div>
                                <div className="flip-card-back d-flex flex-column justify-content-center align-items-center p-3">
                                    <h6 className="text-white text-center mb-2">{anime.title}</h6>
                                    <p className="mb-1 text-center text-white">
                                        Estreia: {new Date(anime.aired.from).toLocaleDateString("pt-BR")}
                                    </p>
                                    <a
                                        href={anime.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-light btn-sm"
                                    >
                                        Ver mais
                                    </a>
                                    <AnimatedButton
                                        initialText="Marcar no calendário"
                                        markedText="Marcado!"
                                        className="nav-btn border b-white p-1"
                                        onClick={() => markItem(anime.mal_id)}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Releases;
