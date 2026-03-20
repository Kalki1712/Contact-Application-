import { Box, Snackbar, Alert } from "@mui/material";
import PageHeader from "../atoms/PageHeader";
import SettingsForm from "../organisms/SettingsForm";

const SettingsTemplate = ({
  formData,
  setFormData,
  imagePreview,
  loading,
  openSnackbar,
  setOpenSnackbar,
  handleImageChange, 
  handleSave,
  onBack,
}) => {
  return (
    <Box p={4}>
      <PageHeader title="Settings" onBack={onBack} />
      <SettingsForm
        formData={formData}
        setFormData={setFormData}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onSave={handleSave}
        loading={loading}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsTemplate;