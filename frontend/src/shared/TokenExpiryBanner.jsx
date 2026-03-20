import { Alert, Button, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TokenExpiryBanner = ({ secondsLeft, onStayLoggedIn }) => {
  return (
    <Alert
      severity="warning"
      icon={<AccessTimeIcon />}
      sx={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "auto",
        minWidth: 360,
        boxShadow: 4,
        alignItems: "center",
      }}
      action={
        <Button
          color="warning"
          variant="contained"
          size="small"
          onClick={onStayLoggedIn}
          sx={{ whiteSpace: "nowrap" }}
        >
          Stay Logged In
        </Button>
      }
    >
      <Box>
        Your session expires in{" "}
        <strong>
          {secondsLeft >= 60
            ? `${Math.floor(secondsLeft / 60)}m ${secondsLeft % 60}s`
            : `${secondsLeft}s`}
        </strong>
      </Box>
    </Alert>
  );
};

export default TokenExpiryBanner;