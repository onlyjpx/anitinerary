import React, { useEffect, useState } from "react";

const News = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch("https://api.jikan.moe/v4/anime?order_by=popularity&limit=5")
            .then((res) => res.json())
            .then((data) => {
                setNews(data.data.slice(0, 5));
            });
    }, []);

    return (
        <div className="bg-transparent p-3 rounded" style={{ border: "1px solid #58a6ff" }}>
            <h4>📰 Últimos Lançamentos</h4>
            <ul className="list-unstyled">
                {news.map((anime) => (
                    <li key={anime.mal_id} className="mb-2">
                        <a href={anime.url} target="_blank" rel="noopener noreferrer">
                            {anime.title} ({anime.aired.string})
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;
