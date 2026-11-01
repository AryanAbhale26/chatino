import React from "react";
import { BsCheck2All } from "react-icons/bs";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const MessageCard = ({
  isReqUserMessage,
  content,
  timestamp,
  profilePic,
  senderName,
}) => {
  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`flex w-full ${
        isReqUserMessage ? "justify-end" : "justify-start"
      } my-1 px-2 group animate-fade-in`}
    >
      {/* Sender Avatar for incoming messages */}
      {!isReqUserMessage && (
        <div className="shrink-0 mr-2 self-end mb-1">
          <img
            src={profilePic || DEFAULT_AVATAR}
            alt={senderName || "Sender"}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[75%] sm:max-w-[65%] md:max-w-[55%] px-3.5 pt-2 pb-1.5 shadow-md ${
          isReqUserMessage
            ? "bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-xs"
            : "bg-[#202c33] text-[#e9edef] rounded-2xl rounded-tl-xs"
        }`}
      >
        {/* Sender Name for group chats / incoming */}
        {!isReqUserMessage && senderName && (
          <p className="text-xs font-semibold text-[#00a884] mb-0.5 truncate">
            {senderName}
          </p>
        )}

        {/* Message Content */}
        <p className="text-[14.5px] leading-relaxed break-words whitespace-pre-wrap select-text pr-14">
          {content}
        </p>

        {/* Timestamp & Status */}
        <div className="flex items-center justify-end space-x-1 float-right mt-1 ml-2">
          <span className="text-[11px] text-[#8696a0] select-none">
            {formatTime(timestamp)}
          </span>
          {isReqUserMessage && (
            <BsCheck2All className="text-[#53bdeb] text-[15px] shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
