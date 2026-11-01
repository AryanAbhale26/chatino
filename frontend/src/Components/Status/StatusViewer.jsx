import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { BsArrowLeft, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStatusByUserId } from "./StatusData";
import { currentUser } from "../../Redux/Auth/Action";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const STORY_DURATION = 4000;

const formatStatusTime = (dateStr) => {
  if (!dateStr || dateStr.includes("update") || dateStr.includes("Tap")) return dateStr;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    if (isToday) {
      return `Today, ${timeStr}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeStr}`;
    }
    return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
  } catch {
    return dateStr;
  }
};

const StatusViewer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const [statusData, setStatusData] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-fetch current user profile if refreshed on status page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!auth.reqUser && token) {
      dispatch(currentUser(token));
    }
  }, [auth.reqUser, dispatch]);

  // Load user status data asynchronously
  useEffect(() => {
    let isMounted = true;
    const loadStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      try {
        const data = await getStatusByUserId(userId, token, auth.reqUser);
        if (isMounted) {
          setStatusData(data);
          setCurrentStoryIndex(0);
        }
      } catch (err) {
        console.error("Failed to load status:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStatus();
    return () => {
      isMounted = false;
    };
  }, [userId, auth.reqUser]);

  const handleNavigateBack = () => {
    navigate("/status");
  };

  const handleNextStory = () => {
    if (!statusData?.stories) return;
    if (currentStoryIndex < statusData.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      // Finished all stories for this user
      navigate("/status");
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else {
      navigate("/status");
    }
  };

  // Auto-advance interval
  useEffect(() => {
    if (isPaused || !statusData?.stories?.length) return;

    const timer = setTimeout(() => {
      if (currentStoryIndex < statusData.stories.length - 1) {
        setCurrentStoryIndex((prev) => prev + 1);
      } else {
        navigate("/status");
      }
    }, STORY_DURATION);

    return () => clearTimeout(timer);
  }, [currentStoryIndex, isPaused, statusData, navigate]);

  // Keyboard navigation (Arrow keys and Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        handleNextStory();
      } else if (e.key === "ArrowLeft") {
        handlePrevStory();
      } else if (e.key === "Escape") {
        navigate("/status");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStoryIndex, statusData, navigate]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText("");
    setTimeout(() => {
      setReplySent(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#0b141a] text-white">
        <div className="w-10 h-10 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#8696a0]">Loading status updates...</p>
      </div>
    );
  }

  if (!statusData || !statusData.stories?.length) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#0b141a] text-white space-y-4">
        <p className="text-sm text-[#8696a0]">No active stories to view.</p>
        <button
          onClick={handleNavigateBack}
          className="bg-[#00a884] hover:bg-[#00a884]/90 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow transition-transform active:scale-95"
        >
          Back to Status
        </button>
      </div>
    );
  }

  const currentStory = statusData.stories[currentStoryIndex];

  return (
    <div
      className="relative flex flex-col justify-between items-center h-screen w-screen bg-[#0b141a] overflow-hidden select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Top Header & Progress Bars */}
      <div className="w-full max-w-xl px-4 pt-4 z-20">
        {/* Progress Bars */}
        <div className="flex items-center w-full mb-3">
          {statusData.stories.map((_, index) => (
            <ProgressBar
              key={index}
              duration={STORY_DURATION}
              index={index}
              activeIndex={currentStoryIndex}
              isPaused={isPaused}
            />
          ))}
        </div>

        {/* User Info Bar */}
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleNavigateBack}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              title="Back"
            >
              <BsArrowLeft className="text-xl" />
            </button>
            <img
              src={statusData.userAvatar || DEFAULT_AVATAR}
              alt={statusData.userName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <div>
              <p className="font-semibold text-sm leading-tight">
                {statusData.userName}
              </p>
              <p className="text-[11px] text-white/70">
                {formatStatusTime(currentStory?.timestamp || statusData.updatedAt)}
              </p>
            </div>
          </div>

          <button
            onClick={handleNavigateBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Main Story Media */}
      <div className="relative w-full max-w-xl flex-1 flex flex-col items-center justify-center p-4">
        <img
          src={currentStory?.image}
          alt="story"
          className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
        />

        {/* Story Caption */}
        {currentStory?.caption && (
          <div className="mt-3 px-5 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-center text-sm font-medium shadow-lg max-w-md">
            {currentStory.caption}
          </div>
        )}

        {/* Tap/Click Zones: Left side goes prev, Right side goes next */}
        <div
          onClick={handlePrevStory}
          className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10"
          title="Previous"
        />
        <div
          onClick={handleNextStory}
          className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10"
          title="Next"
        />
      </div>

      {/* Prominent Always-Visible Floating Navigation Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrevStory();
        }}
        className="fixed left-5 md:left-10 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-[#202c33]/90 hover:bg-[#00a884] text-[#e9edef] hover:text-white flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-90 cursor-pointer"
        title="Previous Story (Left Arrow)"
        aria-label="Previous Story"
      >
        <BsChevronLeft className="text-2xl font-bold" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNextStory();
        }}
        className="fixed right-5 md:right-10 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-[#202c33]/90 hover:bg-[#00a884] text-[#e9edef] hover:text-white flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-90 cursor-pointer"
        title="Next Story (Right Arrow)"
        aria-label="Next Story"
      >
        <BsChevronRight className="text-2xl font-bold" />
      </button>

      {/* Bottom Reply Bar */}
      <div className="w-full max-w-xl px-4 pb-5 z-20">
        {replySent ? (
          <div className="bg-[#00a884] text-white text-xs font-semibold py-2 px-4 rounded-full text-center shadow-lg animate-fade-in">
            ✓ Reply sent to {statusData.userName}!
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <input
              type="text"
              placeholder={`Reply to ${statusData.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-sm"
            />
            {replyText.trim() && (
              <button
                onClick={handleSendReply}
                className="bg-[#00a884] text-white p-1.5 rounded-full hover:bg-[#00a884]/90 transition-transform active:scale-95"
              >
                <IoSend className="text-sm" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusViewer;
