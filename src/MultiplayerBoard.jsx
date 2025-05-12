// src/MultiplayerBoard.jsx
import React from 'react';
import { Client } from 'boardgame.io/react';
import { MonopolyGame } from './game/MonopolyGame.cjs';
import { SocketIO } from 'boardgame.io/multiplayer';

const Board = ({ G, ctx, moves, playerID, isActive }) => {
  // Защита от undefined (возможно сервер ещё не прислал состояние)
  if (!G || !G.players || !G.players[playerID]) {
    return <div className="p-4 text-gray-500 italic">⏳ Ожидание загрузки игрока {playerID}...</div>;
  }

  const player = G.players[playerID];

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="font-bold text-lg mb-2">🎮 Игрок {playerID}</h2>
      <p>Позиция: {player.position}</p>
      <p>Баланс: ${player.balance}</p>

      {isActive ? (
        <button
          onClick={() => moves.rollDice()}
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🎲 Бросить кубик
        </button>
      ) : (
        <p className="text-sm text-gray-500 mt-2">⏳ Ожидание хода соперника...</p>
      )}

      <hr className="my-3" />
      <h3 className="text-sm font-semibold mb-1">Лог:</h3>
      <ul className="text-sm list-disc pl-4 max-h-40 overflow-auto bg-gray-50 p-2 rounded">
        {G.log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

// Клиент для игрока 0
const Client0 = Client({
  game: MonopolyGame,
  board: Board,
  playerID: '0',
  multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  debug: false,
});

// Клиент для игрока 1
const Client1 = Client({
  game: MonopolyGame,
  board: Board,
  playerID: '1',
  multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  debug: false,
});

export const MonopolyClient0 = () => <Client0 />;
export const MonopolyClient1 = () => <Client1 />;
