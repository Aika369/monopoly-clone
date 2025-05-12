const { Server } = require("boardgame.io/server");
const { MonopolyGame } = require("./src/game/MonopolyGame.cjs");

const server = Server({
  games: [MonopolyGame],
  origins: ["http://localhost:5173"],
});

server.run(8000, () => {
  console.log("🎲 Boardgame.io server запущен на http://localhost:8000");
});
