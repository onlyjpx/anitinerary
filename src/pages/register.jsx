import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/atoms/Input";

const Home = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost/backend/register.php", {
                email,
                password,
                nome
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("Resposta do servidor:", response.data);

            const data = response.data;

            if (data.status === "success") {
                alert("Cadastro bem-sucedido!");
                navigate("/login");
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container text-center mt-5 w-25" style={{ borderRadius: "10px", border: "1px solid white", padding: "20px" }}>
            <div className="container-box mt-4">
                <div className="container-box mx-auto" style={{ color: "white" }}>
                    <h2>Registrar</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome</label>
                            <Input
                                id="nome"
                                type="text"
                                placeholder="Digite seu nome"
                                className="form-control"
                                value={nome}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Digite seu email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Senha</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Digite sua senha"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg b-15"
                            disabled={!email || !password || !nome || loading}
                        >
                            {loading ? "Aguarde..." : "Registrar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
