import { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil, BsCamera } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Redux/Auth/Action";

const DEFAULT_USER_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

const Profile = ({ handleCloseOpenProfile }) => {
  const [flag, setFlag] = useState(false);
  const [username, setUsername] = useState("");
  const [tempPicture, setTempPicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleFlag = () => {
    setUsername(auth.reqUser?.name || "");
    setFlag(true);
  };

  const handleSaveName = () => {
    if (!username.trim()) return;
    setFlag(false);
    const data = {
      id: auth.reqUser.id,
      token: localStorage.getItem("token"),
      data: { name: username.trim() },
    };
    dispatch(updateUser(data));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    // Read file locally as Data URL so user sees immediate preview and saves locally
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setTempPicture(dataUrl);
      setIsUploading(false);

      // Update user profile in backend database
      const data = {
        id: auth.reqUser?.id,
        token: localStorage.getItem("token"),
        data: { profile: dataUrl },
      };
      dispatch(updateUser(data));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#111b21] animate-fade-in text-[#e9edef]">
      {/* Top Header */}
      <div className="h-[108px] bg-[#202c33] flex items-end px-6 pb-4 space-x-6 border-b border-[#222d34]/60 shrink-0">
        <button
          onClick={handleCloseOpenProfile}
          className="text-[#aebac1] hover:text-[#e9edef] p-1 rounded-full transition-colors"
          title="Back"
        >
          <BsArrowLeft className="text-2xl font-bold" />
        </button>
        <h2 className="text-lg font-semibold tracking-wide">Profile</h2>
      </div>

      {/* Profile Photo Section */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <label
            htmlFor="profileImgInput"
            className="relative cursor-pointer group rounded-full overflow-hidden w-44 h-44 shadow-xl ring-4 ring-[#202c33]"
          >
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={
                tempPicture ||
                auth.reqUser?.profile ||
                DEFAULT_USER_AVATAR
              }
              alt="Profile"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_USER_AVATAR;
              }}
            />
            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <BsCamera className="text-3xl mb-1" />
              <span className="text-xs uppercase font-medium tracking-wider">
                Change Photo
              </span>
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[#00a884] text-xs font-semibold">
                Updating...
              </div>
            )}
          </label>

          <input
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            id="profileImgInput"
            className="hidden"
          />
          <p className="text-xs text-[#8696a0] mt-3">
            Click photo to update profile picture
          </p>
        </div>

        {/* Your Name Section */}
        <div className="bg-[#111b21] rounded-lg p-4 border border-[#222d34]/60 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#00a884] mb-2">
            Your name
          </p>

          {!flag ? (
            <div className="flex justify-between items-center py-1">
              <span className="text-[16px] text-[#e9edef] font-medium">
                {auth.reqUser?.name || "Username"}
              </span>
              <button
                onClick={handleFlag}
                className="text-[#8696a0] hover:text-[#00a884] p-1.5 transition-colors"
                title="Edit name"
              >
                <BsPencil className="text-base" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 py-1">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                autoFocus
                className="flex-1 bg-transparent border-b-2 border-[#00a884] outline-none text-[#e9edef] text-[16px] py-1"
                placeholder="Enter your name"
              />
              <button
                onClick={handleSaveName}
                className="text-[#00a884] hover:text-white p-1.5 transition-colors"
                title="Save name"
              >
                <BsCheck2 className="text-2xl" />
              </button>
            </div>
          )}

          <p className="text-xs text-[#8696a0] mt-3 leading-relaxed">
            This is not your username or PIN. This name will be visible to your Chattingo contacts.
          </p>
        </div>

        {/* Email / About Section */}
        <div className="bg-[#111b21] rounded-lg p-4 border border-[#222d34]/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#00a884] mb-2">
            Email
          </p>
          <p className="text-sm text-[#8696a0] py-1">
            {auth.reqUser?.email || "No email available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
