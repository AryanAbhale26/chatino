import React from "react";
import ChatCard from "../ChatCard/ChatCard";

const DEFAULT_USER_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";
const DEFAULT_GROUP_AVATAR =
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80";

const ChatList = ({
  querys,
  auth,
  chat,
  lastMessages,
  handleClickOnChatCard,
  handleCurrentChat,
  currentChat,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#111b21]">
      {/* Search Results */}
      {querys && (
        <div className="py-1">
          <p className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#00a884]">
            Search Results
          </p>
          {Array.isArray(auth.searchUser) && auth.searchUser.length > 0 ? (
            auth.searchUser.map((user) => (
              <div
                key={user.id}
                onClick={() => handleClickOnChatCard(user.id)}
              >
                <ChatCard
                  name={user.name}
                  userImg={user.profile || DEFAULT_USER_AVATAR}
                  lastMessage={{
                    content: user.email || "Tap to chat",
                  }}
                />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[#8696a0] text-sm">
              No users found matching "{querys}"
            </div>
          )}
        </div>
      )}

      {/* Existing Chats */}
      {!querys && (
        <div>
          {chat?.chats && chat.chats.length > 0 ? (
            chat.chats.map((item) => {
              // Find other user in 1-on-1 chat
              const otherUser =
                item.users?.find((u) => u?.id !== auth.reqUser?.id) ||
                item.users?.[0];

              const chatName = item.group
                ? item.chatName
                : otherUser?.name || "User";

              const chatImg = item.group
                ? item.chatImage || DEFAULT_GROUP_AVATAR
                : otherUser?.profile || DEFAULT_USER_AVATAR;

              const isSelected = currentChat?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleCurrentChat(item)}
                >
                  <ChatCard
                    name={chatName}
                    userImg={chatImg}
                    isGroup={item.group}
                    isActive={isSelected}
                    lastMessage={{
                      content:
                        lastMessages[item.id]?.content || "Tap to open chat",
                      timestamp: lastMessages[item.id]?.timestamp || "",
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-[#8696a0]">
              <div className="w-16 h-16 rounded-full bg-[#202c33] flex items-center justify-center mb-3 text-2xl">
                💬
              </div>
              <p className="text-[#e9edef] font-medium mb-1">No chats yet</p>
              <p className="text-xs text-[#8696a0] max-w-xs">
                Search for someone using the search bar above to start a conversation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
