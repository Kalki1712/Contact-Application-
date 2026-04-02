import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loggedUser, setLoggedUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("remainingSeconds", data.remainingSeconds);
    localStorage.setItem("warnBeforeSec", data.warnBeforeSec);
    localStorage.setItem("user", JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      image: data.image,
    }));
    setToken(data.token);
    setLoggedUser({
      id: data.id,
      name: data.name,
      email: data.email,
      image: data.image,
    });
    navigate("/users");
  };
  
  const logout = useCallback(() => { 
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("remainingSeconds");
    localStorage.removeItem("warnBeforeSec");
    setToken(null);
    setLoggedUser(null);
    navigate("/login");
  }, [navigate]);

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setLoggedUser(updatedUser);
  };

  const value = { 
    loggedUser,
    token,
    login,
    logout,
    updateUser,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};

export default SessionContext;