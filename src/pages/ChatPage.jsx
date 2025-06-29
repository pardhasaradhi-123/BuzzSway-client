import { useState, useContext, useEffect } from "react";
import UserListSidebar from "../components/chat/UserListSidebar";
import PrivateChatBox from "../components/chat/PrivateChatBox";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

const ChatPage = () => {
  const [dmUser, setDmUser] = useState(null);
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.username && socket) {
      socket.emit("add-user", user.username);
    }
  }, [socket, user]);

  return (
    <div className="pt-20 px-2 md:px-6 flex flex-col md:flex-row gap-4 h-[calc(100vh-5rem)] bg-gradient-to-br from-white via-[#fef6ff] to-[#f0f8ff]">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full bg-white shadow-md rounded-lg p-3 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3 text-buzzPrimary">Chats</h3>
        <UserListSidebar setDmUser={setDmUser} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 w-full bg-white rounded-lg shadow-md p-4">
        {dmUser ? (
          <PrivateChatBox dmUser={dmUser} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg font-medium">
              Select a user to start chatting 💬
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
