import {
  AppBar, Toolbar, Typography, IconButton,
  Avatar, Menu, MenuItem, Divider, Box
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useTokenExpiry from "../useTokenExpiry";
import TokenExpiryBanner from "../TokenExpiryBanner";

const Navbar = () => {
  const navigate = useNavigate();

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ position: "relative" }}>

          <IconButton color="inherit" onClick={() => navigate("/users")} sx={{ mr: 2 }}>
            <HomeIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/users")}
          >
            Contact Application
          </Typography>

          <Box sx={{ marginLeft: "auto" }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar src={loggedUser?.image || ""}>
                {!loggedUser?.image && loggedUser?.name?.[0]}
              </Avatar>
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box px={4} py={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={loggedUser?.image || ""} />
            <Box fontWeight="bold">{loggedUser?.name}</Box>
          </Box>
        </Box>

        <Divider />

        <MenuItem onClick={() => { setAnchorEl(null); navigate("/settings"); }}>
          Settings
        </MenuItem>
        <MenuItem>Help</MenuItem>

        <Divider />

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("remainingSeconds");
            localStorage.removeItem("warnBeforeSec");    
            navigate("/login");
          }}
        >
          Logout
        </MenuItem>
      </Menu>

      {showWarning && (
        <TokenExpiryBanner
          secondsLeft={secondsLeft}       
          onStayLoggedIn={handleStayLoggedIn}
        />
      )}
    </>
  );
};

export default Navbar;


// import {
//   AppBar, Toolbar, Typography, IconButton,
//   Avatar, Menu, MenuItem, Divider, Box
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect, useCallback } from "react";
// import useTokenExpiry from "../useTokenExpiry";
// import TokenExpiryBanner from "../TokenExpiryBanner";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const [loggedUser, setLoggedUser] = useState(
//     JSON.parse(localStorage.getItem("user"))
//   );
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

  
//   const handleExpired = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   }, [navigate]);

//   const { showWarning, minutesLeft, handleStayLoggedIn } = useTokenExpiry(handleExpired);

//   useEffect(() => {
//     const updateUser = () => {
//       setLoggedUser(JSON.parse(localStorage.getItem("user")));
//     };
//     window.addEventListener("userUpdated", updateUser);
//     return () => window.removeEventListener("userUpdated", updateUser);
//   }, []);

//   return (
//     <>
//       <AppBar position="sticky" color="primary">
//         <Toolbar sx={{ position: "relative" }}>

//           <IconButton color="inherit" onClick={() => navigate("/users")} sx={{ mr: 2 }}>
//             <HomeIcon />
//           </IconButton>

//           <Typography
//             variant="h6"
//             sx={{
//               position: "absolute",
//               left: "50%",
//               transform: "translateX(-50%)",
//               fontWeight: "bold",
//               cursor: "pointer",
//             }}
//             onClick={() => navigate("/users")}
//           >
//             Contact Application
//           </Typography>

//           <Box sx={{ marginLeft: "auto" }}>
//             <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
//               <Avatar src={loggedUser?.image || ""}>
//                 {!loggedUser?.image && loggedUser?.name?.[0]}
//               </Avatar>
//             </IconButton>
//           </Box>

//         </Toolbar>
//       </AppBar>

//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={() => setAnchorEl(null)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Box px={4} py={2}>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Avatar src={loggedUser?.image || ""} />
//             <Box fontWeight="bold">{loggedUser?.name}</Box>
//           </Box>
//         </Box>

//         <Divider />

//         <MenuItem onClick={() => { setAnchorEl(null); navigate("/settings"); }}>
//           Settings
//         </MenuItem>
//         <MenuItem>Help</MenuItem>

//         <Divider />

//         <MenuItem
//           sx={{ color: "error.main" }}
//           onClick={() => {
//             localStorage.removeItem("token");
//             localStorage.removeItem("user");
//             navigate("/login");
//           }}
//         >
//           Logout
//         </MenuItem>
//       </Menu>

//       {/*  Warning banner */}
//       {showWarning && (
//         <TokenExpiryBanner
//           minutesLeft={minutesLeft}
//           onStayLoggedIn={handleStayLoggedIn}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;