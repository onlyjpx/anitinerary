import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "../atoms/Button";
import SearchBar from "../molecules/SearchBar";
import { FaHouse, FaToriiGate, FaUserLarge, FaMoon } from "react-icons/fa6";
import "../styles/Navbar.css";
import { AnimatePresence, motion } from "framer-motion";
import { UserContext } from "../../UserContext";

const Navbar = () => {
    const handleSearch = (query) => {
        console.log("Buscando por:", query);
    };

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const { user, logout } = useContext(UserContext);
    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <nav className="Navbar">
            <div className="d-flex" style={{ width: "50px", height: "50px" }}>
                <Link to="/">
                    <img src="../extra/logo-site-icon.png" alt="logo" height={40} />
                </Link>
                <Link to="/" className="nav-link"><Button className="nav-btn" icon={FaHouse} tooltip={"Home"} /></Link>
            </div>
            <div className="nav-buttons">
                <SearchBar onSearch={handleSearch} />
                <Link to="/realeases" className="nav-link"><Button className="nav-btn" icon={FaToriiGate} tooltip={"Lançamentos"} /></Link>
            </div>
            <div className="user-configs">
                <Button className="nav-btn" icon={FaMoon} tooltip={"Modo Escuro"} />
                <div className="d-inline-block position-relative">
                    <Button className="nav-btn" icon={FaUserLarge} onClick={toggle} tooltip={"Login"} />
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="position-absolute rounded p-2 mt-2 text-white"
                                style={{ border: "1px solid #58a6ff", right: 0, minWidth: "150px", zIndex: 1000, background: "#0d1117" }}
                            >
                                {user ? (
                                    <div className="d-flex flex-column">
                                        <Link to="/profile" className="nav-link d-block" onClick={toggle}>Perfil</Link>
                                        <Link to="/events" className="nav-link d-block" onClick={toggle}>Eventos</Link>
                                        <Button text="Sair" className="nav-btn text-warning" onClick={handleLogout} />
                                    </div>
                                ) : (
                                    <>
                                        <Link to="/login" className="nav-link d-block" onClick={toggle}>Login</Link>
                                        <Link to="/register" className="nav-link d-block" onClick={toggle}>Registrar</Link>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
