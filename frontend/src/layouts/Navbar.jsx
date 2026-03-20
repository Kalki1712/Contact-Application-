import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useTokenExpiry from "../hooks/useTokenExpiry";
import AppNavbar from "../components/organisms/AppNavbar";

const Navbar = () => {
  const navigate = useNavigate();

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const handleExpired = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("remainingSeconds");
    localStorage.removeItem("warnBeforeSec");
    navigate("/login");
  }, [navigate]);

  const { showWarning, secondsLeft, handleStayLoggedIn } = useTokenExpiry(handleExpired);

  useEffect(() => {
    const updateUser = () => {
      setLoggedUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("userUpdated", updateUser);
    return () => window.removeEventListener("userUpdated", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("remainingSeconds");
    localStorage.removeItem("warnBeforeSec");
    navigate("/login");
  };

  return (
    <AppNavbar
      loggedUser={loggedUser}
      onHomeClick={() => navigate("/users")}
      onLogout={handleLogout}
      showWarning={showWarning}
      secondsLeft={secondsLeft}
      onStayLoggedIn={handleStayLoggedIn}
    />
  );
};

export default Navbar;