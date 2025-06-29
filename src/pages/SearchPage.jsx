import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!user) return alert("Please login to search users.");
    if (!searchTerm.trim()) return;

    try {
      const res = await API.get(`/users/search?query=${searchTerm}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
        Search Users
      </h2>

      {/* Search Input */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by username or email..."
          className="flex-1 border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-2 rounded-full font-medium shadow hover:opacity-90 transition"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-4"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username[0]}`}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </Link>

              <Link
                to={`/profile/${user._id}`}
                className="text-sm text-pink-500 hover:underline font-medium"
              >
                View Profile
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="min-h-96 flex justify-center items-center">
          <p className="text-gray-400 text-lg italic">No users found</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
