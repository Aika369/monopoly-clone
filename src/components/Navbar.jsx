import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">🎲 Монополия</div>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Главная</Link>
        <Link to="/game" className="hover:underline">Игровое поле</Link>
        <Link to="/rules" className="hover:underline">Правила</Link>
        <Link to="/leaderboard" className="hover:underline">🏆 Лидерборд</Link>
      </div>
    </nav>
  );
}
