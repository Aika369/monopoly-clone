// components/CardModal.jsx

import React from "react";

export default function CardModal({ visible, onClose, title, text }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center animate-fadeIn">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{text}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
