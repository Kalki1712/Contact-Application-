import { useEffect, useState } from "react"
import axios from "./axiosInstance"

const useTokenExpiry = (onExpired) => {
  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [rerenderKey, setRerenderKey] = useState(0) 

  useEffect(() => {
    const token = localStorage.getItem("token")
    const remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"))
    const warnBeforeSec = parseInt(localStorage.getItem("warnBeforeSec"))

    if (!token || !remainingSeconds || !warnBeforeSec) return

    let seconds = remainingSeconds

    if (seconds <= 0) {
      onExpired()
      return
    }

    if (seconds <= warnBeforeSec) {
      setShowWarning(true)
      setSecondsLeft(seconds)
    }

    const countdownInterval = setInterval(() => {
      seconds -= 1
      localStorage.setItem("remainingSeconds", seconds)

      if (seconds <= 0) {
        clearInterval(countdownInterval)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("remainingSeconds")
        localStorage.removeItem("warnBeforeSec")
        onExpired()
        return
      }

      if (seconds <= warnBeforeSec) {
        setShowWarning(true)
      }

      setSecondsLeft(seconds)
    }, 1000)

    return () => clearInterval(countdownInterval) 

  }, [onExpired, rerenderKey]) 

  const handleStayLoggedIn = async () => {
    try {
      const res = await axios.post("/auth/refresh")
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("remainingSeconds", res.data.remainingSeconds)
      localStorage.setItem("warnBeforeSec", res.data.warnBeforeSec)
      setShowWarning(false)
      setSecondsLeft(null)
      setRerenderKey(prev => prev + 1) 
      window.dispatchEvent(new Event("tokenRefreshed"))
    } catch (err) {
      console.error("Refresh failed:", err)
      onExpired()
    }
  }

  return { showWarning, secondsLeft, handleStayLoggedIn }
}

export default useTokenExpiry



// import { useEffect, useState } from "react"
// import axios from "./axiosInstance"

// const WARN_BEFORE_MS = 5 * 60 * 1000

// const useTokenExpiry = (onExpired) => {
//   const [showWarning, setShowWarning] = useState(false)
//   const [minutesLeft, setMinutesLeft] = useState(null)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     const expiresAt = parseInt(localStorage.getItem("expiresAt")) 
//     if (!token || !expiresAt) return

//     let warnTimer
//     let expireTimer
//     let countdownInterval

//     try {
//       const now = Date.now()
//       const timeUntilExpiry = expiresAt - now
//       const timeUntilWarn = timeUntilExpiry - WARN_BEFORE_MS

//       if (timeUntilExpiry <= 0) {
//         onExpired()
//         return
//       }

//       if (timeUntilWarn <= 0) {
//         setShowWarning(true)
//         setMinutesLeft(Math.max(0, Math.floor(timeUntilExpiry / 60000)))
//       } else {
//         warnTimer = setTimeout(() => {
//           setShowWarning(true)
//           setMinutesLeft(5)
//         }, timeUntilWarn)
//       }

//       countdownInterval = setInterval(() => {
//         const remaining = expiresAt - Date.now()
//         if (remaining <= 0) {
//           clearInterval(countdownInterval)
//           setMinutesLeft(0)
//         } else {
//           setMinutesLeft(Math.max(0, Math.ceil(remaining / 60000)))
//         }
//       }, 30000)

//       expireTimer = setTimeout(() => {
//         localStorage.removeItem("token")
//         localStorage.removeItem("user")
//         localStorage.removeItem("expiresAt") 
//         onExpired()
//       }, timeUntilExpiry)

//     } catch (err) {
//       console.error("Token expiry error:", err)
//       onExpired()
//     }

//     return () => {
//       clearTimeout(warnTimer)
//       clearTimeout(expireTimer)
//       clearInterval(countdownInterval)
//     };
//   }, [onExpired])

//   const handleStayLoggedIn = async () => {
//     try {
//       const res = await axios.post("/auth/refresh")
//       localStorage.setItem("token", res.data.token)
//       localStorage.setItem("expiresAt", res.data.expiresAt) 
//       setShowWarning(false)
//       setMinutesLeft(null)
//       window.dispatchEvent(new Event("tokenRefreshed"))
//     } catch (err) {
//       console.error("Refresh failed:", err)
//       onExpired()
//     }
//   }

//   return { showWarning, minutesLeft, handleStayLoggedIn }
// }

// export default useTokenExpiry






// import { useEffect, useState } from "react"
// import { jwtDecode } from "jwt-decode"
// import axios from "./axiosInstance"

// const WARN_BEFORE_MS = 5 * 60 * 1000 

// const useTokenExpiry = (onExpired) => {
//   const [showWarning, setShowWarning] = useState(false)
//   const [minutesLeft, setMinutesLeft] = useState(null)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (!token) return

//     let warnTimer
//     let expireTimer
//     let countdownInterval

//     try {
//       const { exp } = jwtDecode(token)
//       const expiresAt = exp * 1000
//       const now = Date.now()
//       const timeUntilExpiry = expiresAt - now
//       const timeUntilWarn = timeUntilExpiry - WARN_BEFORE_MS


//       console.log("Token expiry:", exp)
//       console.log("Expires at:", new Date(exp * 1000))  

//       console.log("Token expires at:", new Date(exp * 1000));
//       console.log("Minutes until expiry:", (exp * 1000 - Date.now()) / 60000);

//       if (timeUntilExpiry <= 0) {
//         onExpired()
//         return
//       }  //already expired

//       if (timeUntilWarn <= 0) {
//         // Less than 5 minsshow warning immediately
//         setShowWarning(true)
//         setMinutesLeft(Math.max(0, Math.floor(timeUntilExpiry / 60000)))
        
//       } else {
//         // Show warning 5 mins before expiry
//         warnTimer = setTimeout(() => {
//           setShowWarning(true)
//           setMinutesLeft(5)
//         }, timeUntilWarn)
//       }

//       // Count every 30 seconds
//       countdownInterval = setInterval(() => {
//         const remaining = expiresAt - Date.now()
//         if (remaining <= 0) {
//           clearInterval(countdownInterval)
//           setMinutesLeft(0)
//         } else {
//           setMinutesLeft(Math.max(0, Math.ceil(remaining / 60000)))
//         }
//       }, 30000)

//       // Auto logout 
//       expireTimer = setTimeout(() => {
//         localStorage.removeItem("token")
//         localStorage.removeItem("user")
//         onExpired()
//       }, timeUntilExpiry)

//     } catch (err) {
//       console.error("Token decode error:", err)
//       onExpired()
//     }

//     return () => {
//       clearTimeout(warnTimer)
//       clearTimeout(expireTimer)
//       clearInterval(countdownInterval)
//     };
//   }, [onExpired])

//   const handleStayLoggedIn = async () => {
//     try {
//       const res = await axios.post("/auth/refresh")
//       localStorage.setItem("token", res.data.token)
//       setShowWarning(false)
//       setMinutesLeft(null)
//       window.dispatchEvent(new Event("tokenRefreshed"))
//     } catch (err) {
//       console.error("Refresh failed:", err)
//       onExpired()  
//     }
//   }

//   return { showWarning, minutesLeft, handleStayLoggedIn }
// }
 
// export default useTokenExpiry