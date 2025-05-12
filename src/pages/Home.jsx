// src/pages/Home.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const availableIcons = ["🚗", "🐶", "🎩", "🚢", "🛩️", "🚀", "🛴", "🏎️"];

export default function Home() {
  const navigate = useNavigate();

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1Piece, setPlayer1Piece] = useState("");
  const [player2Piece, setPlayer2Piece] = useState("");
  const [useBot, setUseBot] = useState(false);

  const handleStart = () => {
    if (!player1Name || !player1Piece || (!useBot && (!player2Name || !player2Piece))) {
      alert("Пожалуйста, введите имена и выберите фишки для игроков.");
      return;
    }

    if (!useBot && player1Piece === player2Piece) {
      alert("Игроки не могут выбрать одинаковые фишки!");
      return;
    }

    localStorage.setItem("player1", player1Name);
    localStorage.setItem("player2", useBot ? "Бот" : player2Name);
    localStorage.setItem("player1Piece", player1Piece);
    localStorage.setItem("player2Piece", player2Piece || "🤖");
    localStorage.setItem("useBot", useBot.toString());

    navigate("/game");
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">🎲 Добро пожаловать в Монополию</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Имя Игрока 1:</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Игрок 1"
          />
        </div>

        <div>
          <label className="block font-semibold">Имя Игрока 2:</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            placeholder={useBot ? "Бот" : "Игрок 2"}
            disabled={useBot}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="font-semibold mb-2">Фишка Игрока 1:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                className={`text-2xl border rounded px-3 py-1 ${
                  player1Piece === icon ? "bg-blue-200" : ""
                }`}
                onClick={() => setPlayer1Piece(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Фишка Игрока 2:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                className={`text-2xl border rounded px-3 py-1 ${
                  player2Piece === icon ? "bg-pink-200" : ""
                }`}
                onClick={() => setPlayer2Piece(icon)}
                disabled={useBot}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={useBot}
            onChange={(e) => setUseBot(e.target.checked)}
          />
          Играть с ботом
        </label>
      </div>

      <button
        className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
        onClick={handleStart}
      >
        🚀 Начать игру
      </button>

      <div className="mt-4">
        <p className="text-gray-500 text-sm">Или сыграть с другом по сети:</p>
        <button
          onClick={() => navigate("/multiplayer")}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
        >
          🌐 Перейти в Multiplayer
        </button>
      </div>
    </div>
  );
}
