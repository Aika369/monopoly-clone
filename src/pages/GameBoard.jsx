import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TileCell from "../components/TileCell";
import CardModal from "../components/CardModal";
import TradeModal from "../components/TradeModal";
import { tiles } from "../data/tiles";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const BOARD_SIZE = 10;
const TOTAL_TILES = 40;

const useBot = localStorage.getItem("useBot") === "true";
const player1Name = localStorage.getItem("player1") || "Игрок 1";
const player2Name = localStorage.getItem("player2") || "Игрок 2";
const player1Piece = localStorage.getItem("player1Piece");
const player2Piece = localStorage.getItem("player2Piece");

export default function GameBoard() {
  if (!player1Piece || !player2Piece) {
    window.location.href = "/";
    return null;
  }

  const chanceCards = [
    "Получите $100",
    "Заплатите $50",
    "Идите на старт",
    "Пропустите следующий ход",
  ];

  const chestCards = [
    "Получите $200",
    "Заплатите налоги $100",
    "Подарок от бабушки: $50",
    "Идите в тюрьму",
  ];

  const initialPlayers = [
    {
      name: player1Name,
      position: 0,
      balance: 1500,
      properties: [],
      bankrupt: false,
      isBot: false,
      skipTurn: false,
      color: "bg-blue-500",
      icon: player1Piece,
    },
    {
      name: player2Name,
      position: 0,
      balance: 1500,
      properties: [],
      bankrupt: false,
      isBot: useBot,
      skipTurn: false,
      color: "bg-pink-500",
      icon: player2Piece,
    },
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [log, setLog] = useState(() => JSON.parse(localStorage.getItem("monopoly_log")) || []);
  const [countdown, setCountdown] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [cardModal, setCardModal] = useState(null);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);

  const appendLog = (text) => {
    setLog((prev) => {
      const updated = [...prev, text];
      localStorage.setItem("monopoly_log", JSON.stringify(updated));
      return updated;
    });
  };

  const clearLog = () => {
    setLog([]);
    localStorage.removeItem("monopoly_log");
  };

  const resetGame = () => {
    clearLog();
    tiles.forEach((t) => delete t.owner);
    setPlayers(initialPlayers.map((p) => ({ ...p })));
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setWinner(null);
    setShowCongrats(false);
    appendLog("🔁 Игра начата заново");
    toast("🎮 Игра сброшена и начата заново");
  };

  const sellPropertiesToCoverDebt = (player) => {
    let moneyRaised = 0;
    for (let propId of player.properties) {
      const tile = tiles.find((t) => t.id === propId);
      if (tile) {
        moneyRaised += Math.floor(tile.price / 2);
        delete tile.owner;
      }
    }
    appendLog(`${player.name} продал все владения за $${moneyRaised}`);
    toast(`${player.name} продал все владения за $${moneyRaised}`);
    player.balance += moneyRaised;
    player.properties = [];
  };

  const checkBankruptcy = (player) => {
    if (player.balance < 0 && player.properties.length > 0) {
      sellPropertiesToCoverDebt(player);
    }
    if (player.balance < 0) {
      player.bankrupt = true;
      appendLog(`${player.name} обанкротился!`);
      toast.error(`${player.name} обанкротился!`);
    }
  };

  const checkWinner = (updatedPlayers) => {
    const active = updatedPlayers.filter((p) => !p.bankrupt);
    if (active.length === 1) {
      const winnerName = active[0].name;
      setWinner(winnerName);
      setShowCongrats(true);
      confetti();
      toast.success(`🏆 Победа: ${winnerName}`);
      const leaderboard = JSON.parse(localStorage.getItem("monopoly_leaderboard")) || [];
      leaderboard.push({ name: winnerName, date: new Date().toISOString() });
      localStorage.setItem("monopoly_leaderboard", JSON.stringify(leaderboard));
    }
  };

  const drawCard = (type, player) => {
    const cardList = type === "chance" ? chanceCards : chestCards;
    const card = cardList[Math.floor(Math.random() * cardList.length)];
    appendLog(`${player.name} вытянул карточку: ${card}`);
    setCardModal({ title: type === "chance" ? "Карточка Шанс" : "Общественная казна", text: card });

    if (card.includes("Получите $")) {
      const amount = parseInt(card.match(/\d+/)[0]);
      player.balance += amount;
    } else if (card.includes("Заплатите")) {
      const amount = parseInt(card.match(/\d+/)[0]);
      player.balance -= amount;
    } else if (card.includes("на старт")) {
      player.position = 0;
    } else if (card.includes("Пропустите")) {
      player.skipTurn = true;
    } else if (card.includes("в тюрьму")) {
      player.position = 10;
    }
  };

  const shouldBotBuyTile = (tile, botPlayer) => {
    if (!tile || tile.owner) return false;
    const sameColorTiles = tiles.filter((t) => t.color && t.color === tile.color);
    const ownedOfSameColor = sameColorTiles.filter((t) => t.owner === botPlayer.name).length;
    const totalSameColor = sameColorTiles.length;
    const ownsHalfOrMore = ownedOfSameColor >= Math.floor(totalSameColor / 2);
    return botPlayer.balance > tile.price * (ownsHalfOrMore ? 0.5 : 1.2);
  };

  const rollDice = () => {
    setDiceRolling(true);
    setDiceValue(null);
    new Audio("/sounds/dice.mp3").play();

    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setDiceValue(dice);

      const updatedPlayers = [...players];
      const player = { ...updatedPlayers[currentPlayerIndex] };

      if (player.skipTurn) {
        appendLog(`${player.name} пропускает ход`);
        player.skipTurn = false;
        updatedPlayers[currentPlayerIndex] = player;
        setPlayers(updatedPlayers);
        setCountdown(3);
        setDiceRolling(false);
        return;
      }

      player.position = (player.position + dice) % TOTAL_TILES;
      appendLog(`${player.name} бросил кубик: ${dice}`);

      const tile = tiles.find((t) => t.id === player.position);
      appendLog(`${player.name} встал на "${tile.label}"`);

      if (tile?.label?.includes("Шанс")) drawCard("chance", player);
      else if (tile?.label?.includes("казна")) drawCard("chest", player);

      if (tile?.price && !tile.owner) {
        const shouldBuy = player.isBot ? shouldBotBuyTile(tile, player) : confirm(`${player.name}, купить ${tile.label} за $${tile.price}?`);
        if (shouldBuy && player.balance >= tile.price) {
          tile.owner = player.name;
          player.balance -= tile.price;
          player.properties.push(tile.id);
          appendLog(`${player.name} купил ${tile.label} за $${tile.price}`);
          toast.success(`${player.name} купил ${tile.label}`);
        }
      } else if (tile?.owner && tile.owner !== player.name) {
        const rent = tile.rent ?? Math.floor(tile.price * 0.2);
        const ownerIndex = updatedPlayers.findIndex((p) => p.name === tile.owner);
        if (ownerIndex >= 0) {
          player.balance -= rent;
          updatedPlayers[ownerIndex].balance += rent;
          appendLog(`${player.name} платит $${rent} игроку ${tile.owner}`);
          toast(`${player.name} платит $${rent} игроку ${tile.owner}`);
        }
      }

      checkBankruptcy(player);
      updatedPlayers[currentPlayerIndex] = player;
      setPlayers(updatedPlayers);
      checkWinner(updatedPlayers);
      setCountdown(3);
      setDiceRolling(false);
    }, 1000);
  };

  const handleTrade = ({ targetPlayer, propertyId, price }) => {
    const updatedPlayers = [...players];
    const buyer = updatedPlayers[currentPlayerIndex];
    const seller = updatedPlayers.find((p) => p.name === targetPlayer);
    const tile = tiles.find((t) => t.id === parseInt(propertyId));

    if (!tile || !seller.properties.includes(parseInt(propertyId))) {
      toast.error("Недопустимая сделка.");
      return;
    }

    buyer.balance -= price;
    seller.balance += price;
    tile.owner = buyer.name;
    buyer.properties.push(parseInt(propertyId));
    seller.properties = seller.properties.filter((id) => id !== parseInt(propertyId));

    appendLog(`${buyer.name} купил ${tile.label} у ${seller.name} за $${price}`);
    toast.success(`${buyer.name} купил ${tile.label}`);
    setPlayers(updatedPlayers);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    } else {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const current = players[currentPlayerIndex];
    if (current.isBot && !current.bankrupt && !current.skipTurn) {
      const delay = setTimeout(() => rollDice(), 1000);
      return () => clearTimeout(delay);
    }
  }, [currentPlayerIndex]);

  const getTileNumber = (row, col) => {
    if (row === 0) return col;
    if (col === BOARD_SIZE - 1) return BOARD_SIZE - 1 + row;
    if (row === BOARD_SIZE - 1) return (BOARD_SIZE - 1) * 3 - col;
    if (col === 0) return (BOARD_SIZE - 1) * 4 - row;
    return null;
  };

  const cells = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tileNumber = getTileNumber(row, col);
      const tile = tiles.find((t) => t.id === tileNumber);
      const playersHere = players.filter((p) => p.position === tileNumber && !p.bankrupt);
      cells.push(
        <TileCell
          key={`${row}-${col}`}
          tile={tile}
          tileNumber={tileNumber}
          playersHere={playersHere.map((p) => ({ name: p.name, color: p.color, icon: p.icon }))}
        />
      );
    }
  }

  const current = players[currentPlayerIndex];

  return (
    <>
      <Navbar />
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Поле Монополии 10×10</h2>
        <div className="grid grid-cols-10 w-max">{cells}</div>

        {!current.isBot && !current.bankrupt && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={rollDice}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={countdown !== null || diceRolling}
            >
              Ходит: {current.name} — Бросить кубик
            </button>
            <button
              onClick={() => setTradeModalOpen(true)}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              💰 Сделка
            </button>
          </div>
        )}

        {diceRolling && (
          <div className="mt-4 animate-spin w-12 h-12 text-2xl font-bold text-purple-600">🎲</div>
        )}

        {diceValue && !diceRolling && (
          <img src={`/dice/dice${diceValue}.png`} alt={`Кубик ${diceValue}`} className="w-16 h-16 mt-4" />
        )}

        {countdown !== null && (
          <p className="mt-2 text-sm text-gray-600">Следующий ход через: {countdown}</p>
        )}

        <div className="mt-4 w-full flex justify-around">
          {players.map((p, i) => (
            <div key={i} className="text-sm">
              <strong>{p.name}</strong> {p.icon} — 💰 ${p.balance} {p.bankrupt && "💥 Банкрот"}
              <br />
              Владения: {p.properties.length ? p.properties.join(", ") : "-"}
            </div>
          ))}
        </div>

        <div className="mt-6 w-full max-h-64 overflow-y-auto border p-2 bg-gray-100 rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">📜 Ход игры:</h3>
            <div className="flex gap-4">
              <button onClick={clearLog} className="text-xs text-red-600 underline">Очистить лог</button>
              <button onClick={resetGame} className="text-xs text-blue-600 underline">Начать заново</button>
            </div>
          </div>
          <ul className="text-xs list-disc pl-5">
            {log.map((entry, i) => <li key={i}>{entry}</li>)}
          </ul>
        </div>
      </div>

      <CardModal visible={!!cardModal} title={cardModal?.title} text={cardModal?.text} onClose={() => setCardModal(null)} />

      <TradeModal
        visible={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        players={players}
        currentPlayer={players[currentPlayerIndex]}
        onTrade={handleTrade}
      />

      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">🎉 Поздравляем, {winner}!</h2>
            <p>Вы победили в игре!</p>
            <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Играть снова
            </button>
          </div>
        </div>
      )}
    </>
  );
}
