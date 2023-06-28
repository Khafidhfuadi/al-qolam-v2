import React from "react";
import MuridDashboard from "./Murid/Dashboard";
import GuruDashboard from "./Guru/Dashboard";
import AdminDashboard from "./Admin/Dashboard";
import Test from "./Test";

const Home = ({ user, handleLogout }) => {
  return (
    <>
      {user && user?.role === "murid" ? (
        <MuridDashboard user={user} handleLogout={handleLogout} />
      ) : // <Test />
      user && user?.role === "guru" ? (
        <GuruDashboard user={user} />
      ) : user && user?.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : null}
    </>
  );
};

export default Home;
