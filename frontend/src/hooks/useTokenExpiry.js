import { useEffect, useState } from "react";
import axios from "../axiosInstance";

const useTokenExpiry = (onExpired) => {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"));
    const warnBeforeSec = parseInt(localStorage.getItem("warnBeforeSec"));

    if (!token || !remainingSeconds || !warnBeforeSec) return;

    let seconds = remainingSeconds;

    if (seconds <= 0) {
      onExpired();
      return;
    }

    if (seconds <= warnBeforeSec) {
      setShowWarning(true);
      setSecondsLeft(seconds);
    }

    const countdownInterval = setInterval(() => {
      seconds -= 1;
      localStorage.setItem("remainingSeconds", seconds);

      if (seconds <= 0) {
        clearInterval(countdownInterval);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("remainingSeconds");
        localStorage.removeItem("warnBeforeSec");
        onExpired();
        return;
      }

      if (seconds <= warnBeforeSec) {
        setShowWarning(true);
      }

      setSecondsLeft(seconds);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [onExpired, rerenderKey]);

  const handleStayLoggedIn = async () => {
    try {
      const res = await axios.post("/auth/refresh");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("remainingSeconds", res.data.remainingSeconds);
      localStorage.setItem("warnBeforeSec", res.data.warnBeforeSec);
      setShowWarning(false);
      setSecondsLeft(null);
      setRerenderKey(prev => prev + 1);
      window.dispatchEvent(new Event("tokenRefreshed"));
    } catch (err) {
      console.error("Refresh failed:", err);
      onExpired();
    }
  };

  return { showWarning, secondsLeft, handleStayLoggedIn };
};

export default useTokenExpiry;