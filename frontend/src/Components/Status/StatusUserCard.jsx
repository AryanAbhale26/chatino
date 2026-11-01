import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const StatusUserCard = ({
  user,
  isMyStatus,
  hasStory,
  onAddStatus,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isMyStatus && !hasStory) {
      if (onAddStatus) onAddStatus();
      return;
    }
    navigate(`/status/${user?.userId || "my_status"}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center px-4 py-3 cursor-pointer hover:bg-[#202c33]/70 transition-colors group"
    >
      {/* Avatar Container with WhatsApp-style Ring */}
      <div className="relative shrink-0 mr-4">
        <div
          className={`p-[2px] rounded-full ${
            hasStory
              ? "ring-2 ring-[#00a884] ring-offset-2 ring-offset-[#111b21]"
              : "ring-1 ring-white/10"
          }`}
        >
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={user?.userAvatar || DEFAULT_AVATAR}
            alt={user?.userName || "User"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        </div>

        {/* Plus badge for adding status */}
        {isMyStatus && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddStatus) onAddStatus();
            }}
            title="Add status update"
            className="absolute bottom-0 right-0 bg-[#00a884] hover:bg-[#00a884]/90 text-white rounded-full p-1 ring-2 ring-[#111b21] transition-transform active:scale-90"
          >
            <AiOutlinePlus className="text-xs font-bold" />
          </button>
        )}
      </div>

      {/* Text Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#e9edef] truncate group-hover:text-[#00a884] transition-colors">
          {isMyStatus ? "My status" : user?.userName || "Contact"}
        </p>
        <p className="text-xs text-[#8696a0] truncate mt-0.5">
          {isMyStatus
            ? hasStory
              ? user?.updatedAt || "Tap to view updates"
              : "Tap to add status update"
            : user?.updatedAt || "Recent update"}
        </p>
      </div>
    </div>
  );
};

export default StatusUserCard;
