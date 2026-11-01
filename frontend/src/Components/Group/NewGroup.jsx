import { useState } from "react";
import { BsArrowLeft, BsCheck2, BsCamera } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

const DEFAULT_GROUP_AVATAR =
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=150&q=80";

const NewGroup = ({ groupMember, setIsGroup, onBack }) => {
  const [groupImage, setGroupImage] = useState(null);
  const [groupName, setGroupName] = useState("");
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    let userIds = [];
    for (let user of groupMember) {
      userIds.push(user.id);
    }

    const group = {
      userIds,
      chatName: groupName.trim(),
      chatImage: groupImage || DEFAULT_GROUP_AVATAR,
    };

    dispatch(createGroupChat({ group, token }));
    setIsGroup(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setGroupImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#111b21] animate-fade-in text-[#e9edef]">
      {/* Header */}
      <div className="h-[108px] bg-[#202c33] flex items-end px-6 pb-4 space-x-6 border-b border-[#222d34]/60 shrink-0">
        <button
          onClick={onBack || (() => setIsGroup(false))}
          className="text-[#aebac1] hover:text-[#e9edef] p-1 rounded-full transition-colors"
          title="Back"
        >
          <BsArrowLeft className="text-2xl font-bold" />
        </button>
        <h2 className="text-lg font-semibold tracking-wide">New Group</h2>
      </div>

      {/* Group Details Form */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Group Photo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <label
            htmlFor="groupImgInput"
            className="relative cursor-pointer group rounded-full overflow-hidden w-36 h-36 ring-4 ring-[#202c33] shadow-lg"
          >
            <img
              src={groupImage || DEFAULT_GROUP_AVATAR}
              alt="Group"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <BsCamera className="text-2xl mb-1" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Add Photo
              </span>
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            id="groupImgInput"
            className="hidden"
            onChange={handleImageChange}
          />
          <p className="text-xs text-[#8696a0] mt-2">
            Add a group icon (optional)
          </p>
        </div>

        {/* Group Subject */}
        <div className="bg-[#111b21] rounded-lg p-4 border border-[#222d34]/60 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#00a884] block mb-2">
            Group Subject
          </label>
          <input
            className="w-full bg-[#202c33] text-[#e9edef] placeholder-[#8696a0] px-4 py-2.5 rounded-lg text-sm outline-none border border-transparent focus:border-[#00a884]"
            placeholder="Type group name here..."
            value={groupName}
            type="text"
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
            autoFocus
          />
          <p className="text-xs text-[#8696a0] mt-2">
            Provide a group subject and optional group icon
          </p>
        </div>

        {/* Participants count review */}
        <div className="bg-[#111b21] rounded-lg p-4 border border-[#222d34]/60">
          <span className="text-xs text-[#8696a0]">
            Participants:{" "}
            <strong className="text-[#e9edef]">
              {groupMember ? groupMember.size : 0} members selected
            </strong>
          </span>
        </div>
      </div>

      {/* Done Button */}
      {groupName.trim() && (
        <div className="p-4 bg-[#202c33] flex justify-end shrink-0 border-t border-[#222d34]/60">
          <button
            onClick={handleCreateGroup}
            className="bg-[#00a884] hover:bg-[#00a884]/90 text-white p-3.5 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center"
            title="Create group"
          >
            <BsCheck2 className="text-3xl font-bold" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NewGroup;
