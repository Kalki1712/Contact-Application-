import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageHeader = ({ title, onBack }) => {
  return (
    <Box display="flex" alignItems="center" mb={4}>
      <IconButton onClick={onBack}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
    </Box>
  );
};

export default PageHeader;