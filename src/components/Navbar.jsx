import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiMessageCircle,
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"; // ✅ Add your logo image here

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center fixed top-0 w-full z-10">
      {/* Logo and App Name */}
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="BuzzSway Logo"
          className="w-9 h-9 object-contain"
        />
        <h1 className="text-xl font-bold text-buzzPrimary max-md:hidden">
          BuzzSway
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-1 transition ${
              isActive ? "text-buzzPrimary font-medium" : "text-gray-700"
            }`
          }
        >
          <FiHome />
          <span className="hidden md:inline">Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-1 transition ${
              isActive ? "text-buzzPrimary font-medium" : "text-gray-700"
            }`
          }
        >
          <FiSearch />
          <span className="hidden md:inline">Search</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex items-center gap-1 transition ${
              isActive ? "text-buzzPrimary font-medium" : "text-gray-700"
            }`
          }
        >
          <FiMessageCircle />
          <span className="hidden md:inline">Chat</span>
        </NavLink>

        <NavLink
          to={`/profile/${user?.id}`}
          className={({ isActive }) =>
            `flex items-center gap-1 transition ${
              isActive ? "text-buzzPrimary font-medium" : "text-gray-700"
            }`
          }
        >
          <FiUser />
          <span className="hidden md:inline">Profile</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-1 transition ${
              isActive ? "text-buzzPrimary font-medium" : "text-gray-700"
            }`
          }
        >
          <FiBarChart2 />
          <span className="hidden md:inline">Analytics</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
        >
          <FiLogOut />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
