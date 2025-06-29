import { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
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
