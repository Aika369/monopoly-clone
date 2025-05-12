// components/TileCell.jsx

function getColor(color) {
  const colorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    brown: "bg-yellow-900",
    lightblue: "bg-sky-300",
    pink: "bg-pink-400",
    gray: "bg-gray-500",
  };
  return colorMap[color] || "";
}

function getOrientationClass(tileNumber) {
  if (tileNumber <= 10 || tileNumber >= 30) return "horizontal-text";
  return "vertical-text";
}

export default function TileCell({ tile, tileNumber, playersHere }) {
  const isChance = tile?.label?.includes("Шанс");
  const isChest =
    tile?.label?.includes("казна") || tile?.label?.includes("Общественная казна");

  const isOwned = tile?.owner;
  const ownerClass = isOwned ? "owned" : "";
  const ownerColor =
    tile?.owner === "Игрок 1"
      ? "owner-player1"
      : tile?.owner === "Игрок 2"
      ? "owner-player2"
      : "";

  return (
    <div
      className={`aspect-square w-20 border text-[9px] flex flex-col justify-between overflow-hidden p-1 text-center relative
        ${tile ? "bg-white shadow-sm" : "bg-gray-100"}
        ${isChance ? "bg-yellow-100" : ""}
        ${isChest ? "bg-blue-100" : ""}
        ${ownerClass} ${ownerColor}
      `}
    >
      {/* Цветовая полоса */}
      {tile?.color && <div className={`w-full h-2 ${getColor(tile.color)}`}></div>}

      {/* Название и цена */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`break-words ${getOrientationClass(tileNumber)}`}>
          {tile?.label && (
            <div className="font-semibold mb-1">
              {tile.label.replace(
                /^(Зелёная|Красная|Синяя|Голубая|Жёлтая|Оранжевая|Розовая|Фиолетовая|Коричневая|Серая):\s*/,
                ""
              )}
            </div>
          )}
          {tile?.price && (
            <div>
              💵 ${tile.price} {tile?.rent ? ` | 🏠 $${tile.rent}` : ""}
            </div>
          )}
        </div>
      </div>

      {/* Владелец */}
      {isOwned && (
        <div className="absolute top-0 right-0 text-[8px] bg-black text-white px-1 rounded-bl">
          {tile.owner}
        </div>
      )}

      {/* Игроки */}
      {playersHere.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
          {playersHere.map((p, idx) => (
            <span key={idx} className="text-xs">{p.icon}</span>
          ))}
        </div>
      )}
    </div>
  );
}
