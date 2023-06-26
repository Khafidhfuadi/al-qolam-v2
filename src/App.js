import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import NotFound from "./components/NotFound/notFound";
import Register from "./components/auth/Register";
import KelasDetail from "./components/Murid/KelasDetail";
import ProfileDetail from "./components/ProfileDetail";
import IndexNavbar from "./components/Nav/IndexNavbar";
import Maintenence from "./components/Maintenence";

const App = () => {
  // const savedUser = JSON.parse(localStorage.getItem("user"));
  // console.log(savedUser);
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    return savedUser || null;
  });

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };


  const handleLogin = (data) => {
    const { token, user } = data;
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* index navbar */}
          <Route element={<IndexNavbar user={user} handleLogout={handleLogout} />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/maintenence" element={<Maintenence />} />
          <Route exact path="/" element={<PrivateRoute user={user} />}>
            <Route
              exact
              path="/"
              element={<Home user={user} handleLogout={handleLogout} />}
            />
            <Route
              exact
              path="/detail-kelas/:id"
              element={<KelasDetail user={user} handleLogout={handleLogout} />}
            />
            <Route
              exact
              path="/detail-profil"
              element={<ProfileDetail user={user} handleLogout={handleLogout} handleSetUser={handleSetUser}/>}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
