import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const AppBarHeader = ({ onHomeClick, title, rightSlot }) => {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ position: "relative" }}>

        <IconButton color="inherit" onClick={onHomeClick} sx={{ mr: 2 }}>
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
          onClick={onHomeClick}
        >
          {title}
        </Typography>


   
        {/* Right — anything passed in (avatar, menu, etc) */}
        {rightSlot}

      </Toolbar>
    </AppBar>
  );
};

export default AppBarHeader;
