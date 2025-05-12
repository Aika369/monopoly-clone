import React from "react";
import { MonopolyClient0, MonopolyClient1 } from "../MultiplayerBoard";

export default function MultiplayerPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">🎮 Сетевая игра Монополия</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MonopolyClient0 />
        <MonopolyClient1 />
      </div>
    </div>
  );
}