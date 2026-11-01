import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const SelectedMember = ({ handleRemoveMember, member }) => {
  return (
    <div className="flex items-center bg-[#202c33] border border-[#222d34] rounded-full pl-1 pr-2 py-0.5 shadow-sm text-xs text-[#e9edef]">
      <img
        className="w-5 h-5 rounded-full object-cover mr-1.5"
        src={member.profile || DEFAULT_AVATAR}
        alt={member.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_AVATAR;
        }}
      />
      <span className="truncate max-w-[100px] mr-1.5 font-medium">{member.name}</span>
      <button
        onClick={() => handleRemoveMember(member)}
        className="text-[#8696a0] hover:text-[#ef4444] p-0.5 rounded-full transition-colors"
      >
        <AiOutlineClose className="text-xs" />
      </button>
    </div>
  );
};

export default SelectedMember;
