import { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // ✅ Connect to backend hosted on Railway, not Netlify
    const newSocket = io("https://buzzsway-server-production.up.railway.app", {
      withCredentials: true,
      transports: ["websocket"], // ✅ Force WebSocket to avoid 404s
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      if (user?.username) {
        newSocket.emit("add-user", user.username);
      }
    });

    return () => newSocket.disconnect();
  }, [user?.username]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
