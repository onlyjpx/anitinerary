import { motion } from "framer-motion";
import { useState } from "react";
import "../atoms/Button.css"

const AnimatedButton = ({
    initialText = "",
    markedText = "",
    onMark = () => { },
    className = "",
    onClick,
    ...props
}) => {
    const [marked, setMarked] = useState(false);

    const handleClick = (e) => {
        setMarked(true);
        onMark();

        if (onClick) {
            onClick(e);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleClick}
            animate={{
                backgroundColor: marked ? "#28a745" : "", // verde ou azul
                color: "#fff",
            }}
            transition={{ duration: 0.3 }}
            className={`${className}`}
            {...props}
        >
            {marked ? markedText : initialText}
        </motion.button>
    );
};

export default AnimatedButton;
