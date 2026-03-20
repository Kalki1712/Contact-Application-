import {
  Avatar,
  Menu, 
  MenuItem,
  Divider, 
  Box,
  IconButton,
  } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ loggedUser, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ marginLeft: "auto" }}>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar src={loggedUser?.image || ""}>
          {!loggedUser?.image && loggedUser?.name?.[0]}
        </Avatar>
      </IconButton>

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
          onClick={() => { setAnchorEl(null); onLogout(); }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;