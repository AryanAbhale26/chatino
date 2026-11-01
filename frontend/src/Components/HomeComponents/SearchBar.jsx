import React from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";

const SearchBar = ({ querys, setQuerys, handleSearch }) => {
  return (
    <div className="flex items-center gap-2 bg-[#111b21] px-3 py-2 border-b border-[#222d34]/60">
      <div className="relative flex-1 flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#00a884]">
        <AiOutlineSearch className="text-[#8696a0] text-lg mr-2 shrink-0" />
        <input
          className="bg-transparent border-none outline-none text-[#e9edef] placeholder-[#8696a0] text-[14px] w-full"
          type="text"
          placeholder="Search or start new chat"
          value={querys || ""}
          onChange={(e) => {
            setQuerys(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        {querys && (
          <button
            onClick={() => {
              setQuerys("");
              handleSearch("");
            }}
            className="text-[#8696a0] hover:text-[#e9edef] p-0.5 ml-1"
          >
            <AiOutlineClose className="text-sm" />
          </button>
        )}
      </div>

      <button
        title="Filter chats"
        className="p-1.5 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33] rounded-full transition-colors"
      >
        <BsFilter className="text-xl" />
      </button>
    </div>
  );
};

export default SearchBar;
