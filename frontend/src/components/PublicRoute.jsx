import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/users" replace /> : children;
};

export default PublicRoute;


// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   return isLoggedIn ? <Navigate to="/users" replace /> : children;
// };

// export default PublicRoute;
