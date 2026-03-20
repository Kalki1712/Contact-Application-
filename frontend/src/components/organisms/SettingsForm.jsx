import { Box, Paper, Button } from "@mui/material";
import AvatarUpload from "../molecules/AvatarUpload";
import SettingsFormFields from "../molecules/SettingsFormFields";

const SettingsForm = ({
  formData, setFormData,
  imagePreview, onImageChange,
  onSave, loading,
}) => {
  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: 420 }}>
        <AvatarUpload
          imagePreview={imagePreview}
          name={formData.name}
          onImageChange={onImageChange}
        />
        <SettingsFormFields
          formData={formData}
          setFormData={setFormData}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
          onClick={onSave}
        >
          {loading ? "Saving..." : "Update"}
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsForm;