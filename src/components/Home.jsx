import React from "react";
import MuridDashboard from "./Murid/Dashboard";
import GuruDashboard from "./Guru/Dashboard";
import AdminDashboard from "./Admin/Dashboard";

const Home = ({ user, handleLogout }) => {
  return (
    <>
      {user && user?.role === "murid" ? (
        <MuridDashboard user={user} handleLogout={handleLogout} />
      ) : user && user?.role === "guru" ? (
        <GuruDashboard user={user} />
      ) : user && user?.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : null}
    </>
  );
};

export default Home;
