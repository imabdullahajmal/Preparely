import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateQuiz from "./pages/CreateQuiz";
import QuizView from "./pages/QuizView";
import Home from "./pages/Home";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* alias for users visiting /signup (backend uses /signup) */}
        <Route path="/signup" element={<Register />} />
        <Route path="/quiz/:id" element={<ProtectedRoute><QuizView /></ProtectedRoute>} />
      </Routes>
    </>
  );
}