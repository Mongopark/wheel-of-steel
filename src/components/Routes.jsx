import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./Home";
import Login from "./Login";
import { useAuthStore } from "../store";

function App() {
    const isAuth = useAuthStore((state) => state.isAuthenticated);
    

  return (
    <Routes>
      <Route path="/" element={isAuth ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;