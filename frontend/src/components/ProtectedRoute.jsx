import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   return localStorage.getItem("isLoggedIn")
//     ? children
//     : <Navigate to="/login" />;
// };

// export default ProtectedRoute;


 


 




