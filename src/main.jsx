import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import GameBoard from "./pages/GameBoard.jsx";
import Rules from "./pages/Rules.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import "./index.css";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GameBoard />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/leaderboard" element={<Leaderboard />} /> {/* ✅ */}
          </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </>
    </BrowserRouter>
  </React.StrictMode>
);
