import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineCamera, AiOutlinePlus } from "react-icons/ai";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import StatusUserCard from "./StatusUserCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyStatuses,
  addMyStatus,
  getAllContactStatuses,
} from "./StatusData";
import { currentUser } from "../../Redux/Auth/Action";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const Status = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [myStories, setMyStories] = useState([]);
  const [contactStatuses, setContactStatuses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusImage, setStatusImage] = useState(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef(null);

  // Auto-fetch profile if user navigates directly or refreshes on /status
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!auth.reqUser && token) {
      dispatch(currentUser(token));
    }
  }, [auth.reqUser, dispatch]);

  const fetchStatusData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const [myData, contactData] = await Promise.all([
      getMyStatuses(token),
      getAllContactStatuses(token),
    ]);
    setMyStories(myData || []);
    setContactStatuses(contactData || []);
  };

  useEffect(() => {
    fetchStatusData();
  }, [auth.reqUser?.id]);

  const handleNavigateBack = () => {
    navigate("/");
  };

  const handleOpenAdd = () => {
    setShowAddModal(true);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const rawData = reader.result;
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setStatusImage(compressed);
        } catch (err) {
          setStatusImage(rawData);
        }
      };
      img.onerror = () => {
        setStatusImage(rawData);
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  const handlePublishStatus = async () => {
    const token = localStorage.getItem("token");
    if (!statusImage || !token) return;

    const updated = await addMyStatus(token, {
      image: statusImage,
      caption: caption.trim(),
    });
    setMyStories(updated);
    setShowAddModal(false);
    setStatusImage(null);
    setCaption("");
    fetchStatusData();
  };

  const myStatusUser = {
    userId: "my_status",
    userName: auth.reqUser?.name || "My Status",
    userAvatar: auth.reqUser?.profile || DEFAULT_AVATAR,
    updatedAt:
      myStories.length > 0
        ? `${myStories.length} update${myStories.length > 1 ? "s" : ""}`
        : "No updates (tap to add)",
  };

  return (
    <div className="w-screen h-screen flex bg-[#0c1317] text-[#e9edef] overflow-hidden select-none">
      {/* Left Sidebar */}
      <div className="w-[30%] min-w-[340px] max-w-[460px] h-full flex flex-col bg-[#111b21] border-r border-[#222d34]/60">
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#202c33] flex items-center justify-between border-b border-[#222d34]/60">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleNavigateBack}
              className="text-[#aebac1] hover:text-[#e9edef] p-1 rounded-full transition-colors"
              title="Back to chats"
            >
              <BsArrowLeft className="text-2xl font-bold" />
            </button>
            <h1 className="text-xl font-semibold">Status</h1>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 bg-[#00a884] hover:bg-[#00a884]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all active:scale-95"
            title="Create new status"
          >
            <AiOutlinePlus className="text-sm font-bold" />
            <span>Add Status</span>
          </button>
        </div>

        {/* Status Scroll List */}
        <div className="flex-1 overflow-y-auto">
          {/* My Status Card */}
          <div className="pt-2 pb-1 border-b border-[#222d34]/60">
            <StatusUserCard
              user={myStatusUser}
              isMyStatus={true}
              hasStory={myStories.length > 0}
              onAddStatus={handleOpenAdd}
            />
          </div>

          {/* Recent Updates Header */}
          <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#00a884]">
            Recent updates
          </div>

          {/* Contact Status Cards or Empty State */}
          {contactStatuses.length > 0 ? (
            <div className="divide-y divide-[#222d34]/40">
              {contactStatuses.map((item) => (
                <StatusUserCard
                  key={item.userId}
                  user={item}
                  hasStory={true}
                />
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-[#8696a0]">
              <div className="w-12 h-12 rounded-full bg-[#202c33] flex items-center justify-center mx-auto mb-3 text-xl">
                ⭕
              </div>
              <p className="text-sm text-[#e9edef] font-medium mb-1">
                No recent updates
              </p>
              <p className="text-xs text-[#8696a0] max-w-xs mx-auto">
                Status updates shared by your contacts in the last 24 hours will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Empty View / Placeholder */}
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-[#0b141a] relative p-8 text-center">
        <button
          onClick={handleNavigateBack}
          className="absolute top-5 right-6 text-[#8696a0] hover:text-white p-2 rounded-full hover:bg-[#202c33] transition-colors"
          title="Close status"
        >
          <AiOutlineClose className="text-2xl" />
        </button>

        <div className="w-24 h-24 rounded-full bg-[#202c33] flex items-center justify-center text-4xl mb-4 text-[#00a884] shadow-inner ring-1 ring-white/10">
          ⭕
        </div>
        <h2 className="text-2xl font-medium text-[#e9edef] mb-2">
          {myStories.length > 0
            ? "Click on My Status to view your updates"
            : "No status updates available"}
        </h2>
        <p className="text-sm text-[#8696a0] max-w-sm mb-6">
          Share photos or updates with your contacts. Status updates disappear after 24 hours.
        </p>

        <button
          onClick={handleOpenAdd}
          className="bg-[#00a884] hover:bg-[#00a884]/90 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
        >
          <AiOutlineCamera className="text-lg" />
          <span>Post a Status Update</span>
        </button>
      </div>

      {/* Add Status Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#202c33] rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#e9edef]">
                Add New Status
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setStatusImage(null);
                  setCaption("");
                }}
                className="text-[#8696a0] hover:text-white p-1"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            </div>

            {/* Photo Upload Area */}
            <div className="mb-5">
              {statusImage ? (
                <div className="relative rounded-xl overflow-hidden max-h-64 flex justify-center bg-black/40 ring-1 ring-white/10">
                  <img
                    src={statusImage}
                    alt="Status Preview"
                    className="max-h-64 object-contain"
                  />
                  <button
                    onClick={() => setStatusImage(null)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#8696a0]/30 hover:border-[#00a884] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#111b21]/50 group"
                >
                  <AiOutlineCamera className="text-4xl text-[#8696a0] group-hover:text-[#00a884] mb-2 transition-colors" />
                  <p className="text-sm text-[#e9edef] font-medium">
                    Upload a photo
                  </p>
                  <p className="text-xs text-[#8696a0] mt-1">
                    Click to select from your computer
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* Caption Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePublishStatus()}
                className="w-full bg-[#111b21] text-[#e9edef] placeholder-[#8696a0] px-4 py-2.5 rounded-lg text-sm outline-none border border-[#222d34] focus:border-[#00a884]"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setStatusImage(null);
                  setCaption("");
                }}
                className="px-4 py-2 text-sm text-[#8696a0] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishStatus}
                disabled={!statusImage}
                className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition-all ${
                  statusImage
                    ? "bg-[#00a884] hover:bg-[#00a884]/90 text-white shadow-md active:scale-95"
                    : "bg-[#2a3942] text-[#8696a0] cursor-not-allowed"
                }`}
              >
                <BsCheck2 className="text-lg font-bold" />
                <span>Share Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
