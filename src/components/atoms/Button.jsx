import React from "react";
import { IconContext } from "react-icons";
import './Button.css';
const Button = ({ text, onClick, className, icon: Icon, tooltip }) => {
    return (
        <button className={className} onClick={onClick} title={tooltip}>
            <IconContext.Provider value={{ className: "button-icon" }}>
                {Icon && <Icon size={22} />}
            </IconContext.Provider>
            {text && <span>{text}</span>}
        </button>
    );
};

export default Button;
