import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/axios";

const UserListSidebar = ({ setDmUser }) => {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // 🔵 Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await API.get("/users"); // Adjust if your endpoint differs
        const users = res.data.users || res.data; // adapt to your backend's response format
        setAllUsers(users.filter((u) => u.username !== user.username)); // exclude self
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (user?.id) fetchAllUsers();
  }, [user]);

  // 🟢 Listen for online users
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (usernames) => {
      setOnlineUsers(usernames.filter((u) => u !== user.username));
    };

    socket.on("online-users", handleOnlineUsers);
    return () => socket.off("online-users", handleOnlineUsers);
  }, [socket, user.username]);

  // 🔄 Combine all users + online status
  const combinedUsers = allUsers.map((u) => ({
    username: u.username,
    isOnline: onlineUsers.includes(u.username),
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
        Users
      </h3>

      <ul className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300">
        {combinedUsers.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No users found</p>
        ) : (
          combinedUsers.map((userObj) => (
            <li
              key={userObj.username}
              onClick={() => setDmUser(userObj.username)}
              className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-purple-100 hover:to-orange-100`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    userObj.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    userObj.isOnline ? "text-gray-800" : "text-gray-500 italic"
                  }`}
                >
                  @{userObj.username}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UserListSidebar;
