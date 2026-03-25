const AuthCard = ({ title, children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h5 className="text-xl font-semibold text-center mb-4">
          {title}
        </h5>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;



// import { Box, Paper, Typography } from "@mui/material";

// const AuthCard = ({ title, children }) => {
//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//     >
//       <Paper sx={{ p: 4, width: 350 }}>
//         <Typography variant="h5" textAlign="center">
//           {title}
//         </Typography>
//         {children}
//       </Paper>
//     </Box>
//   );
// };

// export default AuthCard;