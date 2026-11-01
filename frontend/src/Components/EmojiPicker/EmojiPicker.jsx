import React, { useState, useMemo } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const EMOJI_CATEGORIES = [
  {
    id: "smileys",
    name: "Smileys",
    icon: "😀",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "😊", "😇",
      "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛",
      "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒",
      "😞", "😔", "😟", "😕", "🙁", "😣", "😖", "😫", "😩", "🥺", "😢", "😭",
      "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰",
      "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬",
      "🫠", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵",
    ],
  },
  {
    id: "gestures",
    name: "Gestures",
    icon: "👍",
    emojis: [
      "👋", "🤚", "🖐️", "✋", "🖖", "🫱", "🫲", "👌", "🤌", "🤏", "✌️", "🤞",
      "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎",
      "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏", "✍️",
      "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🫀", "🫁",
      "🧠", "🫵", "👀", "👁️", "👅", "👄", "🫦", "👶", "👧", "🧒", "👦", "👩",
    ],
  },
  {
    id: "hearts",
    name: "Hearts",
    icon: "❤️",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💌", "💋", "💯",
      "💢", "💥", "💫", "💦", "💨", "🕳️", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤",
    ],
  },
  {
    id: "activities",
    name: "Activities",
    icon: "🎉",
    emojis: [
      "🎉", "🎊", "🎈", "🎂", "🎁", "🎇", "🎆", "✨", "🏆", "🥇", "🥈", "🥉",
      "🏅", "🎖️", "🎯", "🎮", "🕹️", "🎲", "🧩", "🎳", "⚽", "🏀", "🏈", "⚾",
      "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳", "⛸️", "🎣",
      "🤿", "🎽", "🎿", "🛷", "🥌", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁",
      "🎷", "🎺", "🎸", "🪕", "🎻", "🎟️", "🎫", "🎭", "🎪", "🏷️", "🎪", "🎡",
    ],
  },
  {
    id: "food",
    name: "Food",
    icon: "🍕",
    emojis: [
      "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒",
      "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽",
      "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚",
      "🍳", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🥪",
      "🥙", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🍲", "🍜", "🍝", "🍣", "🍱",
      "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🍫", "🍬", "🍭", "🍮",
      "☕", "🍵", "🧃", "🥤", "🧋", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹",
    ],
  },
  {
    id: "nature",
    name: "Animals",
    icon: "🐶",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁",
      "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤",
      "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋",
      "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", "🪴", "🌲", "🌳", "🌴", "🌵", "🌾",
      "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🍄", "🌰", "🌷", "🌸", "🌹", "🌺",
      "🌻", "🌼", "💐", "☀️", "🌙", "⭐", "🌟", "✨", "⚡", "🔥", "🌈", "🌊",
    ],
  },
  {
    id: "objects",
    name: "Objects",
    icon: "💡",
    emojis: [
      "💡", "🔦", "🕯️", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "📷", "📸",
      "📹", "📼", "🔍", "🔎", "🔬", "🔭", "📡", "⏰", "⏱️", "⏲️", "⏳", "⌛",
      "🔑", "🗝️", "🔒", "🔓", "🔏", "🔐", "✉️", "📧", "📦", "📫", "📬", "💰",
      "💵", "💸", "💳", "💎", "⚖️", "🔧", "🔨", "⚒️", "🛠️", "🪓", "🧰", "🧲",
      "💊", "🩹", "🩺", "🚪", "🛏️", "🛋️", "🚽", "🪞", "🪟", "🛒", "🚀", "🛸",
    ],
  },
];

const EmojiPicker = ({ onSelectEmoji, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("smileys");
  const [searchQuery, setSearchQuery] = useState("");

  const currentEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      const cat = EMOJI_CATEGORIES.find((c) => c.id === activeCategory);
      return cat ? cat.emojis : EMOJI_CATEGORIES[0].emojis;
    }
    // Search across all categories
    const all = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
    // Simple filter
    return all.filter((e) => e.includes(searchQuery.trim()));
  }, [activeCategory, searchQuery]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-80 sm:w-96 h-80 bg-[#202c33] border border-[#222d34] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in z-40 select-none backdrop-blur-md"
    >
      {/* Category Tabs Header */}
      <div className="flex items-center justify-between px-2 pt-2 pb-1 border-b border-[#222d34]/60 bg-[#111b21]/70">
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery("");
              }}
              className={`p-1.5 rounded-lg text-lg transition-all ${
                activeCategory === cat.id && !searchQuery
                  ? "bg-[#2a3942] scale-110 shadow"
                  : "hover:bg-[#2a3942]/60 opacity-70 hover:opacity-100"
              }`}
              title={cat.name}
            >
              {cat.icon}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-[#8696a0] hover:text-white hover:bg-[#2a3942] rounded-full transition-colors ml-1"
          title="Close emoji picker"
        >
          <AiOutlineClose className="text-base" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2 bg-[#202c33]">
        <div className="flex items-center bg-[#111b21] rounded-lg px-2.5 py-1 text-xs">
          <AiOutlineSearch className="text-[#8696a0] text-sm mr-1.5" />
          <input
            type="text"
            placeholder="Search emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-[#e9edef] placeholder-[#8696a0]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#8696a0] hover:text-white"
            >
              <AiOutlineClose className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Emoji Grid Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-7 gap-1.5 content-start">
        {currentEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelectEmoji(emoji)}
            className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-[#2a3942] rounded-xl transition-transform hover:scale-125 active:scale-95"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
