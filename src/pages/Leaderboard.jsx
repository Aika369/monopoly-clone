import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("monopoly_leaderboard")) || [];
    setData(saved);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🏆 Лидерборд</h1>
        {data.length === 0 ? (
          <p className="text-gray-600">Пока нет победителей</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Игрок</th>
                <th className="border px-4 py-2 text-left">Дата победы</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{entry.name}</td>
                  <td className="border px-4 py-2">
                    {new Date(entry.date).toLocaleString("ru-RU", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
