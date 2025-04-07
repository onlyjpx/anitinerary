import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import { UserContext } from "../UserContext";

const Home = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [minimizing, setMinimizing] = useState(false);
    const [finalSuccess, setFinalSuccess] = useState(false);
    const { login } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost/backend/login.php", {
                email,
                password
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const data = response.data;

            if (data.status === "success") {
                login(data.user, data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setSuccess(true); // Ativa bordas verdes

                setTimeout(() => {
                    setMinimizing(true); // Começa a reduzir a altura
                }, 500); // Espera a borda mudar antes de encolher

                setTimeout(() => {
                    setFinalSuccess(true); // Mostra o ícone
                }, 1200); // Espera a altura diminuir antes de exibir o ícone

                setTimeout(() => {
                    navigate("/"); // Redireciona
                }, 3000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="container text-center text-white mt-5 w-25 p-4"
            style={{
                borderRadius: "10px",
                border: "1px solid white",
                backgroundColor: finalSuccess ? "#28a745" : "transparent",
                overflow: "hidden",
                position: "relative",
            }}
            animate={{
                borderColor: success ? "#28a745" : "white",
                height: minimizing ? 100 : "auto", // Diminui suavemente a altura
                transition: { duration: 0.5, ease: "easeInOut" }
            }}
        >
            <AnimatePresence mode="wait">
                {finalSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <FaCheckCircle size={50} color="white" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <h2 style={{ color: "white" }}>Login</h2>
                        <form onSubmit={handleSubmit}>
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
                            <Button
                                type="button"
                                text="Registrar"
                                className="register-btn"
                                onClick={() => navigate("/register")}
                            />
                            <button
                                type="submit"
                                className="nav-btn border b-white"
                                disabled={!email || !password || loading}
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Home;
