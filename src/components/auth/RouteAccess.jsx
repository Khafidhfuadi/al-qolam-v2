import IndexNavbar from "../Nav/IndexNavbar";
import NotFound from "../NotFound/notFound";
import React from "react";

export const withAuthUser = (Component) => {
  // get role from local storage

  const AuthRoute = (props) => {
    if (props.user.role === "murid" || props.user.role === "admin") {
      return (
        <>
          <IndexNavbar {...props} />
          <Component {...props} />
        </>
      );
    } else {
      return <NotFound />;
    }
  };

  return AuthRoute;
};

export const withAuthTeacher = (Component, role) => {
  const AuthRoute = () => {
    if (role === "teacher" || role === "admin") {
      return <Component />;
    } else {
      return <NotFound />;
    }
  };

  return AuthRoute;
};
