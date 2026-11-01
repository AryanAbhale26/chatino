import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const CreateGroup = ({ setIsGroup }) => {
  const [newGroup, setNewGroup] = useState(false);
  const [groupMember, setGroupMember] = useState(new Set());
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);
  const token = localStorage.getItem("token");

  const handleRemoveMember = (member) => {
    const updated = new Set(groupMember);
    updated.delete(member);
    setGroupMember(updated);
  };

  const handleToggleMember = (user) => {
    const updated = new Set(groupMember);
    // check if already selected
    const exists = Array.from(updated).find((m) => m.id === user.id);
    if (exists) {
      updated.delete(exists);
    } else {
      updated.add(user);
    }
    setGroupMember(updated);
  };

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };

  // Contacts available from existing chats
  const chatContacts = [];
  if (chat?.chats) {
    chat.chats.forEach((c) => {
      if (!c.group) {
        const u = c.users?.find((usr) => usr.id !== auth.reqUser?.id);
        if (u && !chatContacts.some((item) => item.id === u.id)) {
          chatContacts.push(u);
        }
      }
    });
  }

  const displayedUsers = query
    ? auth.searchUser || []
    : chatContacts;

  return (
    <div className="w-full h-full flex flex-col bg-[#111b21] animate-fade-in text-[#e9edef]">
      {!newGroup ? (
        <div className="w-full h-full flex flex-col">
          {/* Header */}
          <div className="h-[108px] bg-[#202c33] flex items-end px-6 pb-4 space-x-6 border-b border-[#222d34]/60 shrink-0">
            <button
              onClick={() => setIsGroup(false)}
              className="text-[#aebac1] hover:text-[#e9edef] p-1 rounded-full transition-colors"
              title="Close"
            >
              <BsArrowLeft className="text-2xl font-bold" />
            </button>
            <div>
              <h2 className="text-lg font-semibold tracking-wide">Add group participants</h2>
              <p className="text-xs text-[#8696a0]">
                {groupMember.size} selected
              </p>
            </div>
          </div>

          {/* Selected Members Chips */}
          {groupMember.size > 0 && (
            <div className="p-3 bg-[#111b21] border-b border-[#222d34]/60 flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              {Array.from(groupMember).map((item) => (
                <SelectedMember
                  key={item.id}
                  handleRemoveMember={() => handleRemoveMember(item)}
                  member={item}
                />
              ))}
            </div>
          )}

          {/* Search Member Input */}
          <div className="px-4 py-3 bg-[#111b21] border-b border-[#222d34]/60">
            <input
              type="text"
              className="w-full bg-[#202c33] text-[#e9edef] placeholder-[#8696a0] px-3.5 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#00a884]"
              placeholder="Search contacts"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto">
            {displayedUsers.length > 0 ? (
              displayedUsers.map((item) => {
                const isSelected = Array.from(groupMember).some(
                  (m) => m.id === item.id
                );
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleMember(item)}
                    className={`transition-colors ${
                      isSelected ? "bg-[#2a3942]/60" : ""
                    }`}
                  >
                    <ChatCard
                      userImg={item.profile || DEFAULT_AVATAR}
                      name={item.name}
                      lastMessage={{
                        content: item.email || (isSelected ? "Selected" : "Tap to add"),
                      }}
                      isActive={isSelected}
                    />
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-sm text-[#8696a0]">
                {query
                  ? `No contacts found for "${query}"`
                  : "Search for users above to add them to your group"}
              </div>
            )}
          </div>

          {/* Floating Action Button to proceed */}
          {groupMember.size > 0 && (
            <div className="p-4 bg-[#202c33] flex justify-end shrink-0 border-t border-[#222d34]/60">
              <button
                onClick={() => setNewGroup(true)}
                className="bg-[#00a884] hover:bg-[#00a884]/90 text-white p-3.5 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center"
                title="Next"
              >
                <BsArrowRight className="text-2xl" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <NewGroup
          groupMember={groupMember}
          setIsGroup={setIsGroup}
          onBack={() => setNewGroup(false)}
        />
      )}
    </div>
  );
};

export default CreateGroup;
