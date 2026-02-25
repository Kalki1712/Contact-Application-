import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const updateUser = () => {
      setLoggedUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  return (
    <>
      <AppBar position="sticky" color="primary">
      
        <Toolbar sx={{ position: "relative" }}>

         
          <IconButton
            color="inherit"
            onClick={() => navigate("/users")}
            sx={{ mr: 2 }}
          >
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
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box px={10} py={6}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={loggedUser?.image || ""} />
            <Box fontWeight="bold">{loggedUser?.name}</Box>
          </Box>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/settings");
          }}
        >
          Settings
        </MenuItem>

        <MenuItem>Help</MenuItem>

        <Divider />

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;



