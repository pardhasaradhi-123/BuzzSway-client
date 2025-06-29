import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* ✅ AuthProvider should wrap SocketProvider */}
    <AuthProvider>
      <SocketProvider>
        <App />
        <ToastContainer position="top-right" />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
