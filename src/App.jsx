import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GameBoard from "./pages/GameBoard";
import MultiplayerPage from "./pages/MultiplayerPage";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameBoard />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
      </Routes>
    </Router>
  );
}

export default App;