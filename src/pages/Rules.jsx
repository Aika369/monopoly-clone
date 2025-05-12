import React from "react";

export default function Rules() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎲 Правила игры Монополия</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧩 Цель игры</h2>
        <p>Стать самым богатым игроком, доведя остальных до банкротства через покупку и сдачу в аренду клеток недвижимости.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">🧑‍🤝‍🧑 Подготовка к игре</h2>
        <ul className="list-disc pl-5">
          <li>В игре участвуют <strong>2 игрока</strong> — вы можете играть против другого человека или бота.</li>
          <li>Игроки вводят свои имена и выбирают фишки (🚗, 🐶 и т.д.).</li>
          <li>Каждый игрок начинает с <strong>$1500</strong> и фишкой на поле «Старт».</li>
          <li>Карточки <strong>«Шанс»</strong> и <strong>«Общественная казна»</strong> активируются при попадании на соответствующие клетки.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">🕹️ Ход игры</h2>
        <p>Игроки по очереди бросают <strong>1 кубик</strong> и перемещаются на соответствующее количество клеток. После перемещения игрок выполняет действие, соответствующее типу клетки:</p>
        <ul className="list-disc pl-5 mt-2">
          <li><strong>Недвижимость (улицы):</strong> можно купить или платить аренду.</li>
          <li><strong>Шанс / Общественная казна:</strong> получаете случайную карточку с бонусом или штрафом.</li>
          <li><strong>Налог:</strong> платите указанную сумму.</li>
          <li><strong>Тюрьма:</strong> пропускаете 1 ход.</li>
          <li><strong>Бесплатная стоянка:</strong> пропуск хода без штрафа.</li>
          <li><strong>Старт:</strong> получаете <strong>$200</strong> при каждом прохождении.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">🏠 Недвижимость</h2>
        <p>При покупке клетки игрок становится её владельцем. Аренда взымается автоматически. Владение отображается цветом и именем на клетке.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">💬 Сделки между игроками</h2>
        <p>Игроки могут покупать и продавать собственность друг у друга через кнопку <strong>«Предложить сделку»</strong>, указав ID клетки и сумму.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">⛓️ Тюрьма</h2>
        <p>Игрок может попасть в тюрьму по карточке или при попадании на клетку. В тюрьме игрок пропускает <strong>1 ход</strong>.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">🏁 Конец игры</h2>
        <p>Игра заканчивается, когда один из игроков обанкротится. Побеждает игрок с положительным балансом.</p>
      </section>

      <p className="text-gray-500 text-sm italic">💡 Игра в разработке. В будущих версиях появятся дома, отели и улучшенная логика бота.</p>
    </div>
  );
}
