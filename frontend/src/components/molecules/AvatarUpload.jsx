import { Box, Avatar, Button } from "@mui/material";

const AvatarUpload = ({ imagePreview, name, onImageChange }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
      <Avatar src={imagePreview} sx={{ width: 90, height: 90, mb: 1 }}>
        {!imagePreview && name?.[0]}
      </Avatar>
      <Button variant="outlined" component="label">
        Change Image
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            onImageChange(file);
          }}
        />
      </Button>
    </Box>
  );
};

export default AvatarUpload;