import { Box, Paper, Typography } from "@mui/material";

const AuthCard = ({ title, children }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center">
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
};

export default AuthCard;