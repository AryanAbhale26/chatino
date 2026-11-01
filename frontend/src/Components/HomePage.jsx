import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import CreateGroup from "./Group/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages } from "../Redux/Message/Action";
import SockJs from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { BASE_API_URL } from "../config/api";
import ProfileSection from "./HomeComponents/ProfileSection";
import SearchBar from "./HomeComponents/SearchBar";
import ChatList from "./HomeComponents/ChatList";
import MessageCard from "./MessageCard/MessageCard";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEmojiSmile, BsMicFill, BsThreeDotsVertical, BsShieldLock } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import ImageModal from "./ImageModal/ImageModal";
import EmojiPicker from "./EmojiPicker/EmojiPicker";

const DEFAULT_USER_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";
const DEFAULT_GROUP_AVATAR =
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80";

function HomePage() {
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();
  const [isGroup, setIsGroup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { auth, chat, message } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const messageContainerRef = useRef(null);

  // Profile image zoom modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [modalImageTitle, setModalImageTitle] = useState("");
  const [modalImageSubtitle, setModalImageSubtitle] = useState("");

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Auto-scroll to bottom whenever messages or currentChat change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, currentChat]);

  // Establish WebSocket connection
  const connect = () => {
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJs(`${BASE_API_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
      onConnect: onConnect,
      onStompError: onError,
      debug: (str) => {
        // console.log('STOMP: ' + str);
      },
    });

    setStompClient(client);
    client.activate();
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const onError = (error) => {
    console.log("STOMP error: ", error);
  };

  const onConnect = (frame) => {
    setIsConnected(true);
  };

  const onMessageReceive = (payload) => {
    try {
      const receivedMessage = JSON.parse(payload.body);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    } catch (err) {
      console.error("Error parsing message payload", err);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      try {
        if (stompClient) {
          stompClient.deactivate();
          setIsConnected(false);
        }
      } catch (e) {}
    };
  }, []);

  // Subscribe to the active chat topic
  useEffect(() => {
    if (isConnected && stompClient && stompClient.connected && currentChat?.id) {
      const topic = currentChat.group
        ? `/group/${currentChat.id}`
        : `/user/${currentChat.id}`;

      try {
        const subscription = stompClient.subscribe(topic, onMessageReceive);
        return () => {
          try {
            if (subscription && typeof subscription.unsubscribe === "function") {
              subscription.unsubscribe();
            }
          } catch (e) {}
        };
      } catch (e) {
        console.error("Error subscribing to topic:", e);
      }
    }
  }, [isConnected, stompClient, currentChat]);

  // Send message over WebSocket
  useEffect(() => {
    if (
      message.newMessage &&
      isConnected &&
      stompClient &&
      stompClient.connected &&
      currentChat?.id
    ) {
      try {
        if (typeof stompClient.publish === "function") {
          stompClient.publish({
            destination: "/app/message",
            body: JSON.stringify(message.newMessage),
          });
        } else if (typeof stompClient.send === "function") {
          stompClient.send("/app/message", {}, JSON.stringify(message.newMessage));
        }
        setMessages((prevMessages) => [...prevMessages, message.newMessage]);
      } catch (err) {
        console.error("Error publishing message:", err);
      }
    }
  }, [message.newMessage, isConnected, stompClient, currentChat]);

  useEffect(() => {
    if (message.messages) {
      setMessages(message.messages);
    }
  }, [message.messages]);

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(getAllMessages({ chatId: currentChat.id, token }));
    }
  }, [currentChat, message.newMessage]);

  useEffect(() => {
    dispatch(getUsersChat({ token }));
  }, [chat.createdChat, chat.createdGroup]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOnChatCard = (userId) => {
    dispatch(createChat({ token, data: { userId } }));
    setQuerys("");
  };

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };

  const handleCreateNewMessage = () => {
    if (!content.trim() || !currentChat?.id) return;
    dispatch(
      createMessage({
        token,
        data: { chatId: currentChat.id, content: content.trim() },
      })
    );
    setContent("");
  };

  useEffect(() => {
    dispatch(currentUser(token));
  }, [token]);

  const handleCurrentChat = (item) => {
    setCurrentChat(item);
  };

  useEffect(() => {
    chat?.chats &&
      Array.isArray(chat.chats) &&
      chat.chats.forEach((item) => {
        dispatch(getAllMessages({ chatId: item.id, token }));
      });
  }, [chat?.chats, token, dispatch]);

  useEffect(() => {
    const prevLastMessages = { ...lastMessages };
    if (message.messages && message.messages.length > 0) {
      message.messages.forEach((msg) => {
        if (msg.chat?.id) {
          prevLastMessages[msg.chat.id] = msg;
        }
      });
      setLastMessages(prevLastMessages);
    }
  }, [message.messages]);

  const handleNavigate = () => {
    setIsProfile(true);
  };

  const handleCloseOpenProfile = () => {
    setIsProfile(false);
  };

  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  const handleLogout = () => {
    try {
      if (stompClient && isConnected) {
        stompClient.deactivate();
        setIsConnected(false);
      }
    } catch (e) {}
    dispatch(logoutAction());
    navigate("/signin");
  };

  useEffect(() => {
    if (!auth.reqUser && !token) {
      navigate("/signin");
    }
  }, [auth.reqUser, token]);

  // Determine current active chat details
  const otherUser =
    currentChat?.users?.find((u) => u?.id !== auth?.reqUser?.id) ||
    currentChat?.users?.[0];

  const currentChatName = currentChat?.group
    ? currentChat?.chatName
    : otherUser?.name || "User";

  const currentChatImage = currentChat?.group
    ? currentChat?.chatImage || DEFAULT_GROUP_AVATAR
    : otherUser?.profile || DEFAULT_USER_AVATAR;

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#0c1317]">
      {/* Left Sidebar */}
      <div className="w-[30%] min-w-[340px] max-w-[460px] h-full flex flex-col bg-[#111b21] border-r border-[#222d34]/60 relative z-20">
        {isProfile && (
          <div className="w-full h-full">
            <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
          </div>
        )}

        {isGroup && (
          <div className="w-full h-full">
            <CreateGroup setIsGroup={setIsGroup} />
          </div>
        )}

        {!isProfile && !isGroup && (
          <div className="w-full h-full flex flex-col">
            <ProfileSection
              auth={auth}
              handleNavigate={handleNavigate}
              handleClick={handleClick}
              handleCreateGroup={handleCreateGroup}
              handleLogout={handleLogout}
              handleClose={handleClose}
              open={open}
              anchorEl={anchorEl}
            />

            {/* Sidebar Navigation Tabs (Chats & Status) */}
            <div className="flex bg-[#111b21] border-b border-[#222d34]/60 text-sm font-semibold">
              <button
                className="flex-1 py-2.5 text-center border-b-2 border-[#00a884] text-[#00a884]"
              >
                Chats
              </button>
              <button
                onClick={() => navigate("/status")}
                className="flex-1 py-2.5 text-center border-b-2 border-transparent text-[#8696a0] hover:text-[#e9edef] hover:border-white/10 transition-colors flex items-center justify-center space-x-1.5"
                title="View & post status updates"
              >
                <span>Status</span>
                <span className="w-2 h-2 rounded-full bg-[#00a884]"></span>
              </button>
            </div>

            <SearchBar
              querys={querys}
              setQuerys={setQuerys}
              handleSearch={handleSearch}
            />
            <ChatList
              querys={querys}
              auth={auth}
              chat={chat}
              lastMessages={lastMessages}
              handleClickOnChatCard={handleClickOnChatCard}
              handleCurrentChat={handleCurrentChat}
              currentChat={currentChat}
            />
          </div>
        )}
      </div>

      {/* Right Main Chat Area */}
      <div className="flex-1 h-full flex flex-col bg-[#0b141a] relative">
        {/* Empty State when no chat is selected */}
        {!currentChat?.id && (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center select-none bg-[#111b21]/70">
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#00a884]/20 to-[#00a884]/5 flex items-center justify-center ring-1 ring-[#00a884]/30 shadow-2xl">
                <span className="text-6xl">💬</span>
              </div>
            </div>
            <h1 className="text-3xl font-light text-[#e9edef] mb-2 tracking-wide">
              Chattingo Web
            </h1>
            <p className="text-sm text-[#8696a0] max-w-md leading-relaxed mb-8">
              Send and receive messages in real time. Select a conversation or search for a contact to begin chatting.
            </p>
            <div className="flex items-center text-xs text-[#8696a0] space-x-1.5 bg-[#202c33]/70 px-4 py-2 rounded-full border border-white/5">
              <BsShieldLock className="text-[#00a884] text-sm" />
              <span>End-to-end encrypted messaging</span>
            </div>
          </div>
        )}

        {/* Active Chat Conversation */}
        {currentChat?.id && (
          <div className="w-full h-full flex flex-col">
            {/* Chat Top Header */}
            <div className="shrink-0 px-4 py-2.5 bg-[#202c33] border-b border-[#222d34]/60 flex justify-between items-center z-10 shadow-sm">
              <div className="flex items-center space-x-3.5">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => {
                    setModalImageSrc(currentChatImage);
                    setModalImageTitle(currentChatName);
                    setModalImageSubtitle(
                      currentChat?.group
                        ? `${currentChat?.users?.length || 2} members`
                        : "Click to zoom"
                    );
                    setIsImageModalOpen(true);
                  }}
                  title="Click to zoom profile picture"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-[#00a884] group-hover:scale-105 transition-all shadow"
                    src={currentChatImage}
                    alt={currentChatName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = currentChat?.group
                        ? DEFAULT_GROUP_AVATAR
                        : DEFAULT_USER_AVATAR;
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-[#202c33]"></span>
                </div>
                <div>
                  <h2
                    onClick={() => {
                      setModalImageSrc(currentChatImage);
                      setModalImageTitle(currentChatName);
                      setIsImageModalOpen(true);
                    }}
                    className="text-[16px] font-semibold text-[#e9edef] leading-tight cursor-pointer hover:text-[#00a884] transition-colors"
                  >
                    {currentChatName}
                  </h2>
                  <p className="text-xs text-[#8696a0] mt-0.5">
                    {currentChat?.group
                      ? `${currentChat?.users?.length || 2} members`
                      : "online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-[#aebac1]">
                <button
                  title="Search inside chat"
                  className="p-2 hover:bg-[#111b21]/60 rounded-full transition-colors"
                >
                  <AiOutlineSearch className="text-xl" />
                </button>
                <button
                  title="More options"
                  className="p-2 hover:bg-[#111b21]/60 rounded-full transition-colors"
                >
                  <BsThreeDotsVertical className="text-lg" />
                </button>
              </div>
            </div>

            {/* Scrollable Messages Section */}
            <div
              className="flex-1 overflow-y-auto px-6 py-4 chat-bg-pattern space-y-1.5"
              ref={messageContainerRef}
              onClick={() => setShowEmojiPicker(false)}
            >
              {messages?.length > 0 ? (
                messages.map((item, i) => (
                  <MessageCard
                    key={i}
                    isReqUserMessage={item?.user?.id === auth?.reqUser?.id}
                    content={item.content}
                    timestamp={item.timestamp}
                    profilePic={item?.user?.profile || DEFAULT_USER_AVATAR}
                    senderName={item?.user?.name}
                  />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-[#202c33]/80 px-4 py-2 rounded-lg text-xs text-[#8696a0] max-w-xs shadow">
                    🔒 Messages are end-to-end encrypted. No one outside of this chat can read them.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Section */}
            <div className="shrink-0 bg-[#202c33] px-4 py-2.5 flex items-center space-x-3 border-t border-[#222d34]/60 relative">
              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-3 z-50">
                  <EmojiPicker
                    onSelectEmoji={(emoji) => {
                      setContent((prev) => prev + emoji);
                    }}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                title="Emojis"
                className={`p-1.5 rounded-full transition-colors ${
                  showEmojiPicker
                    ? "text-[#00a884] bg-[#111b21]/70"
                    : "text-[#8696a0] hover:text-[#e9edef] hover:bg-[#111b21]/40"
                }`}
              >
                <BsEmojiSmile className="text-xl" />
              </button>

              <button
                title="Attach"
                className="text-[#8696a0] hover:text-[#e9edef] p-1.5 rounded-full hover:bg-[#111b21]/40 transition-colors"
              >
                <ImAttachment className="text-lg" />
              </button>

              <input
                className="flex-1 py-2.5 px-4 outline-none border-none bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] rounded-lg text-[15px]"
                type="text"
                placeholder="Type a message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateNewMessage();
                    setShowEmojiPicker(false);
                  }
                }}
              />

              {content.trim() ? (
                <button
                  onClick={() => {
                    handleCreateNewMessage();
                    setShowEmojiPicker(false);
                  }}
                  title="Send message"
                  className="bg-[#00a884] text-white p-2.5 rounded-full hover:bg-[#00a884]/90 transition-all shadow-md active:scale-95"
                >
                  <IoSend className="text-lg" />
                </button>
              ) : (
                <button
                  title="Voice message"
                  className="text-[#8696a0] hover:text-[#e9edef] p-2 rounded-full hover:bg-[#111b21]/40 transition-colors"
                >
                  <BsMicFill className="text-xl" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Image Zoom Lightbox Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        src={modalImageSrc}
        title={modalImageTitle}
        subtitle={modalImageSubtitle}
      />
    </div>
  );
}

export default HomePage;