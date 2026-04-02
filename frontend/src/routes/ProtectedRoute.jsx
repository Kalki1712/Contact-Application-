import { Navigate } from "react-router-dom";
import { useSession } from "../global/userSession";

const ProtectedRoute = ({ children }) => {
  const { token } = useSession();
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;



// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

 


 




