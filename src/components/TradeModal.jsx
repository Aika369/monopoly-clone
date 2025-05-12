import React, { useState } from "react";

export default function TradeModal({ visible, onClose, players, currentPlayer, onTrade }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [price, setPrice] = useState(0);

  const handleSubmit = () => {
    if (!selectedPlayer || !selectedProperty || price <= 0) return;
    if (currentPlayer.balance < price) {
      alert("Недостаточно средств для сделки.");
      return;
    }
    onTrade({ targetPlayer: selectedPlayer, propertyId: selectedProperty, price });
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="bg-white p-4 rounded shadow-lg w-80 animate-fadeIn">
        <h2 className="text-lg font-bold mb-2">💼 Сделка между игроками</h2>

        <label className="block mb-1 text-sm font-medium">Выберите игрока:</label>
        <select
          className="w-full border px-2 py-1 rounded mb-2"
          onChange={(e) => setSelectedPlayer(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>-- Игрок --</option>
          {players
            .filter((p) => p.name !== currentPlayer.name && !p.bankrupt)
            .map((p, i) => (
              <option key={i} value={p.name}>{p.name}</option>
            ))}
        </select>

        {selectedPlayer && (
          <>
            <label className="block mb-1 text-sm font-medium">Выберите клетку:</label>
            <select
              className="w-full border px-2 py-1 rounded mb-2"
              onChange={(e) => setSelectedProperty(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>-- Собственность --</option>
              {players.find((p) => p.name === selectedPlayer)?.properties.map((id) => (
                <option key={id} value={id}>Клетка #{id}</option>
              ))}
            </select>

            <label className="block mb-1 text-sm font-medium">Введите сумму ($):</label>
            <input
              type="number"
              className="w-full border px-2 py-1 rounded mb-3"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white py-1 rounded hover:bg-green-600"
            >
              Подтвердить сделку
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 hover:underline"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
