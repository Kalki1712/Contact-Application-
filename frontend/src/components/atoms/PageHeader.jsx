import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageHeader = ({ title, onBack }) => {
  return (
    <div className="flex items-center mb-8">
      <button
        onClick={onBack}
        className="p-2 rounded-full hover:bg-gray-100 
                   transition-colors duration-200 mr-2"
      >
        <ArrowBackIcon />
      </button>
      <h5 className="text-xl font-bold">
        {title}  
      </h5>
    </div>
  );
};

export default PageHeader;



// import { Box, IconButton, Typography } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const PageHeader = ({ title, onBack }) => {
//   return (
//     <Box display="flex" alignItems="center" mb={4}>
//       <IconButton onClick={onBack}>
//         <ArrowBackIcon />
//       </IconButton>
//       <Typography variant="h5" fontWeight="bold">
//         {title}
//       </Typography>
//     </Box>
//   );
// };

// export default PageHeader;