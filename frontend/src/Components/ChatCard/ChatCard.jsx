import React from "react";
import { BsCheck2All } from "react-icons/bs";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const ChatCard = ({ userImg, name, lastMessage, isActive, isGroup }) => {
  // Format readable timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div
      className={`flex items-center px-3.5 py-3 cursor-pointer transition-all duration-150 border-b border-[#222d34]/60 ${
        isActive
          ? "bg-[#2a3942]"
          : "hover:bg-[#202c33]/70"
      }`}
    >
      {/* Profile Image with fallback */}
      <div className="relative shrink-0 mr-3.5">
        <img
          className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
          src={userImg || DEFAULT_AVATAR}
          alt={name || "User"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />
        {/* Subtle online badge indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full ring-2 ring-[#111b21]"></span>
      </div>

      {/* Chat Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-[15px] font-medium text-[#e9edef] truncate pr-2">
            {name || "User"}
          </h3>
          <span className="text-xs text-[#8696a0] shrink-0 font-normal">
            {lastMessage?.timestamp ? formatTimestamp(lastMessage.timestamp) : ""}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-[#8696a0] truncate pr-2">
            {lastMessage?.content && (
              <BsCheck2All className="text-[#53bdeb] text-base mr-1 shrink-0" />
            )}
            <p className="truncate text-[13.5px]">
              {lastMessage?.content || "Click to start chatting"}
            </p>
          </div>

          {isGroup && (
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#00a884] bg-[#00a884]/10 px-1.5 py-0.5 rounded">
              Group
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
