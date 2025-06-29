import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import API from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check for user from cookie
  useEffect(() => {
    const checkAuth = async () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        setUser(JSON.parse(userCookie));
      } else {
        try {
          const res = await API.get("/user/me");
          setUser(res.data.user);
          Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
        } catch (err) {
          setUser(null);
          Cookies.remove("user");
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await API.post("/auth/login", credentials);

    const { user, token } = res.data; // Expecting token from backend
    setUser(user);

    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    Cookies.set("token", token, { expires: 7 }); // ✅ Store token in cookie
  };

  const register = async (data) => {
    const res = await API.post("/auth/register", data);

    const { user, token } = res.data; // Expecting token from backend
    setUser(user);

    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    Cookies.set("token", token, { expires: 7 }); // ✅ Store token
  };

  const logout = async () => {
    setUser(null);
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
