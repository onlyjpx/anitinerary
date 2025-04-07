import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import Countdown from "../components/organisms/countdown";
import News from "../components/organisms/news";
import "../styles.css";

const Home = () => {
    const { user } = useContext(UserContext);
    const userName = user ? user.nome : "Visitante";

    return (
        <div className="container-fluid d-flex">
            <div className="ms-3">
                <h1 className="text-white">Bem-vindo, {userName}!</h1>
                <Countdown eventDate="09-12-2025" eventName="Novo Ano" />
                <div className="ms-3">
                    <News />
                </div>
            </div>
        </div>
    );
};

export default Home;
