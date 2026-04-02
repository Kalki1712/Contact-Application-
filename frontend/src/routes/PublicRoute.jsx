import { Navigate } from "react-router-dom";
import { useSession } from "../global/userSession";

const PublicRoute = ({ children }) => {
  const { token } = useSession();
  return token ? <Navigate to="/users" replace /> : children;
};

export default PublicRoute;



// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? <Navigate to="/users" replace /> : children;
// };

// export default PublicRoute;
