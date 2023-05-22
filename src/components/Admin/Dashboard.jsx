import React from "react";

const AdminDashboard = ({ user }) => {
  return (
    <>
      <h2>Hai Admin, {user.name}</h2>
    </>
  );
};

export default AdminDashboard;
