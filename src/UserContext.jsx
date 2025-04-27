import { createContext, useState, useEffect } from "react";
import { useMarkedItems } from "./hooks/useCalendar";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { clearMarkedItems } = useMarkedItems();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        clearMarkedItems();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, login }}>
            {children}
        </UserContext.Provider>
    );
};

