import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { motion } from "framer-motion";
import "../styles.css";

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const userName = user ? user.nome : "Visitante";
    const userEmail = user ? user.email : "Sem email";

    // só pra ilustrar que funciona visualmente
    const [profilePic, setProfilePic] = useState("https://avatars.githubusercontent.com/u/583231?v=4");

    const handleImageChange = () => {
        const newUrl = prompt("Insira a URL da nova imagem de perfil:");
        if (newUrl) setProfilePic(newUrl);
    };

    return (
        <div className="container py-5 text-white d-flex justify-content-center" style={{ minHeight: "80vh" }}>
            <motion.div
                className="profile-card d-flex flex-column flex-md-row gap-4 bg-dark rounded-4 p-4 shadow-lg align-items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: "100%", maxWidth: "800px" }}
            >
                {/* FOTO DE PERFIL */}
                <div className="text-center">
                    <img
                        src={profilePic}
                        alt="Foto de perfil"
                        className="rounded-circle border border-light mb-3"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <h5 className="mb-2">{userName}</h5>
                    <button className="btn btn-outline-light btn-sm" onClick={handleImageChange}>
                        Alterar imagem
                    </button>
                </div>

                {/* INFORMAÇÕES DO USUÁRIO */}
                <div className="flex-fill">
                    <h4 className="fw-bold">Informações</h4>
                    <hr className="text-secondary" />
                    <p className="mb-2"><strong>👤 Nome:</strong> {userName}</p>
                    <p className="mb-4"><strong>📧 Email:</strong> {userEmail}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-danger"
                        disabled={!user}
                        onClick={() => setUser(null)}
                    >
                        Sair
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
