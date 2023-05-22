import React from "react";
import IndexHeader from "../Headers/IndexHeader";

const GuruDashboard = ({ user }) => {
  return (
    <>
      <IndexHeader user={user} />

      <h2>Hai Guru, {user.name}</h2>
    </>
  );
};

export default GuruDashboard;
