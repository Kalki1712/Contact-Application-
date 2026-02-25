import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  return localStorage.getItem("isLoggedIn")
    ? children
    : <Navigate to="/login" />;
};

export default ProtectedRoute;


 




