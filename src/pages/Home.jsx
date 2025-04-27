import { useContext } from "react";
import { UserContext } from "../UserContext";
import News from "../components/organisms/news";
import MangaSpotlight from "../components/home/MangaSpotlight";
import CalendarPreview from "../components/home/CalendarPreview";
import "../styles.css";
import NextBigRelease from "../components/home/NextBigRelease";

const Home = () => {
    const { user } = useContext(UserContext);
    const userName = user ? user.nome : "Visitante";

    return (
        <div className="container py-5">
            <h1 className="text-center text-white mb-5 display-5 fw-bold">
                Bem-vindo, {userName} !
            </h1>

            {/* Seção superior: Trending + Carrossel de lançamentos */}
            <div className="mb-5">
                <div className="mb-5">
                    <h1 className="text-white mb-4">🔥 Mais Aguardado!!</h1>
                    <NextBigRelease />
                </div>
                <div className="mb-5">
                    <h1 className="text-white mb-4">Próximos Lançamentos</h1>
                    <News />
                </div>
            </div>

            {/* Seção de Destaques de Mangás */}
            <section className="mb-5">
                <MangaSpotlight />
            </section>

            {/* Seção de Prévia do Calendário */}
            <section className="mb-5">
                <CalendarPreview />
            </section>
        </div>
    );
};

export default Home;
