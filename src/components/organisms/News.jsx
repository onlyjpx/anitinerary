import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles.css";
import AnimatedButton from "../atoms/AnimatedButton";

const News = () => {
    const [news, setNews] = useState([]);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const containerRef = useRef(null);
    const innerRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        fetch("https://api.jikan.moe/v4/seasons/upcoming?limit=25")
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.data
                    .filter(anime => anime.aired?.from)
                    .sort((a, b) => new Date(a.aired.from) - new Date(b.aired.from))
                    .slice(0, 5);

                setNews(sorted);
            });
    }, []);

    // Corrige a largura do slider após renderização do layout completo
    useLayoutEffect(() => {
        const handleResize = () => {
            if (containerRef.current && innerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const scrollWidth = innerRef.current.scrollWidth;
                setWidth(scrollWidth - containerWidth);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [news]);

    return (
        <div className="bg-transparent p-3 rounded border border-primary">
            <h4 className="text-white mb-3">Próximos Lançamentos</h4>

            <div ref={containerRef} className="overflow-hidden" style={{ position: "relative" }}>
                <motion.div
                    className="d-flex gap-3"
                    drag="x"
                    dragConstraints={{ left: -width, right: 0 }}
                    ref={innerRef}
                >
                    {news.map((anime) => (
                        <motion.div
                            key={anime.mal_id}
                            className="card bg-dark text-white"
                            style={{ minWidth: "200px", cursor: "pointer" }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedAnime(anime)}
                        >
                            <img
                                src={anime.images?.jpg?.image_url}
                                className="card-img-top"
                                alt={anime.title}
                                style={{ height: "300px", objectFit: "cover" }}
                                onLoad={() => {
                                    // Recalcula largura quando a imagem carrega
                                    if (containerRef.current && innerRef.current) {
                                        const containerWidth = containerRef.current.offsetWidth;
                                        const scrollWidth = innerRef.current.scrollWidth;
                                        setWidth(scrollWidth - containerWidth);
                                    }
                                }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{anime.title}</h5>
                                <p className="card-text">
                                    Estreia: {new Date(anime.aired.from).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedAnime && (
                    <motion.div
                        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedAnime(null)}
                        style={{ zIndex: 9999 }}
                    >
                        <motion.div
                            className="bg-dark text-white p-4 rounded"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: "500px", width: "90%" }}
                        >
                            <img
                                src={selectedAnime.images?.jpg?.image_url}
                                alt={selectedAnime.title}
                                className="img-fluid rounded mb-3"
                            />
                            <h4>{selectedAnime.title}</h4>
                            <p className="mb-2">
                                Estreia prevista:{" "}
                                <strong>{new Date(selectedAnime.aired.from).toLocaleDateString("pt-BR")}</strong>
                            </p>
                            <p>{selectedAnime.synopsis?.slice(0, 300)}...</p>
                            <AnimatedButton
                                initialText="Marcar no calendário"
                                markedText="Marcado ✅"
                                className="nav-btn mt-3"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default News;
