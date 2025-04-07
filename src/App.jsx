import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Realeases from "./pages/Releases";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Register from "./pages/register";
import Navbar from "./components/organisms/Navbar";
import { UserProvider } from "./UserContext";
import "./styles.css"

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/realeases" element={<Realeases />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
