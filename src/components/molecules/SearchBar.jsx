import React, { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="d-flex">
            <Input
                type="text"
                placeholder="Buscar evento..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="me-2 ps-3 rounded-5 bg-transparent"
            />
            <Button text="Buscar" onClick={handleSearch} className="nav-btn" />
        </div>
    );
};

export default SearchBar;
