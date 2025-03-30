import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
    const { isDarkMode, setIsDarkMode } = useTheme();

    return (
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="btn btn-outline-light">
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
        </button>
    );
};

export default ThemeToggle;
