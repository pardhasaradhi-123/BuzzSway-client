import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import SearchPage from "./pages/SearchPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Authentication />}
        />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/" />}
        />
        <Route
          path="/analytics"
          element={user ? <Analytics /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:id"
          element={user ? <ProfilePage /> : <Navigate to="/" />}
        />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;
