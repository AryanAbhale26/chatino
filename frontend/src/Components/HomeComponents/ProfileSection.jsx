import React from "react";
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DEFAULT_USER_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const ProfileSection = ({
  auth,
  handleNavigate,
  handleClick,
  handleCreateGroup,
  handleLogout,
  handleClose,
  open,
  anchorEl,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-4 py-2.5 bg-[#202c33] border-b border-[#222d34]/60">
      {/* Current User Info */}
      <div
        onClick={handleNavigate}
        className="flex items-center space-x-3 cursor-pointer group"
        title="View profile"
      >
        <div className="relative">
          <img
            className="rounded-full w-10 h-10 object-cover ring-2 ring-transparent group-hover:ring-[#00a884] transition-all"
            src={auth.reqUser?.profile || DEFAULT_USER_AVATAR}
            alt={auth.reqUser?.name || "Profile"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_USER_AVATAR;
            }}
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-[#202c33]"></span>
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[#e9edef] group-hover:text-[#00a884] transition-colors truncate max-w-[140px]">
            {auth.reqUser?.name || "My Account"}
          </p>
          <p className="text-[11px] text-[#8696a0]">Available</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1 text-[#aebac1]">
        <button
          onClick={() => navigate("/status")}
          title="Status"
          className="p-2 hover:bg-[#111b21]/60 rounded-full hover:text-[#00a884] transition-colors relative"
        >
          <TbCircleDashed className="text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#00a884] rounded-full"></span>
        </button>

        <button
          onClick={handleCreateGroup}
          title="New Group"
          className="p-2 hover:bg-[#111b21]/60 rounded-full hover:text-[#e9edef] transition-colors"
        >
          <BiCommentDetail className="text-xl" />
        </button>

        <div>
          <button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            title="Menu"
            className="p-2 hover:bg-[#111b21]/60 rounded-full hover:text-[#e9edef] transition-colors"
          >
            <BsThreeDotsVertical className="text-lg" />
          </button>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: "#233138",
                color: "#d1d7db",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                borderRadius: "8px",
                minWidth: "160px",
                "& .MuiMenuItem-root": {
                  fontSize: "14px",
                  padding: "10px 16px",
                  "&:hover": {
                    backgroundColor: "#182229",
                  },
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                handleNavigate();
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleCreateGroup();
              }}
            >
              New Group
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/status");
              }}
            >
              Status Stories
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleLogout();
              }}
              sx={{ color: "#ef4444 !important" }}
            >
              Log out
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
