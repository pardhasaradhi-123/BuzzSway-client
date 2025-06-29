import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/axios";

const PrivateChatBox = ({ dmUser }) => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await API.get(
          `/messages/private/${user.username}/${dmUser}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    if (dmUser) loadMessages();
  }, [dmUser, user.username]);

  useEffect(() => {
    if (!socket) return;

    const handleMsg = (message) => {
      const isChatMatch =
        (message.sender === user.username && message.receiver === dmUser) ||
        (message.receiver === user.username && message.sender === dmUser);

      if (isChatMatch) {
        const enrichedMessage = {
          ...message,
          createdAt: message.createdAt || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, enrichedMessage]);
      }
    };

    socket.on("receive-private-msg", handleMsg);
    return () => socket.off("receive-private-msg", handleMsg);
  }, [socket, dmUser, user.username]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const message = {
      sender: user.username,
      receiver: dmUser,
      content: newMsg.trim(),
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-private-msg", message); // Let backend echo it back
    setNewMsg(""); // Don't update messages here
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-orange-100 border rounded-xl shadow-lg p-4">
      <div className="flex-1 overflow-y-auto px-2 mb-3 space-y-1">
        {messages.map((msg) => {
          const date = msg.createdAt ? new Date(msg.createdAt) : null;
          const time =
            date && !isNaN(date)
              ? date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "";

          const isOwnMsg = msg.sender === user.username;

          return (
            <div
              key={msg._id || msg.createdAt + msg.content}
              className={`my-1 flex ${
                isOwnMsg ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-xs">
                <div
                  className={`px-4 py-2 rounded-xl text-sm ${
                    isOwnMsg
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white"
                      : "bg-gray-100 text-gray-900"
                  } shadow`}
                >
                  {msg.content}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isOwnMsg
                      ? "text-right text-purple-200"
                      : "text-left text-gray-500"
                  }`}
                >
                  {time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
          placeholder={`Message @${dmUser}`}
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-purple-500 to-orange-400 hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PrivateChatBox;
