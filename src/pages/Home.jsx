import { useContext } from "react";
import { UserContext } from "../UserContext";
import Countdown from "../components/organisms/countdown";
import News from "../components/organisms/news";
import "../styles.css";

const Home = () => {
    const { user } = useContext(UserContext);
    const userName = user ? user.nome : "Visitante";

    return (
        <div className="container py-4">
            <h1 className="text-center text-white mb-4">Bem-vindo, {userName}!</h1>

            <div className="row">
                {/* Coluna do Countdown */}
                <div className="col-12 col-md-6 mb-4">
                    <Countdown eventDate="09-12-2025" eventName="Novo Ano" />
                </div>

                {/* Coluna do News */}
                <div className="col-12 col-md-6 mb-4">
                    <News />
                </div>
            </div>
        </div>
    );
};

export default Home;
