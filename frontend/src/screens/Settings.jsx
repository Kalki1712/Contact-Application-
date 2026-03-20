import { useNavigate } from "react-router-dom";
import SettingsTemplate from "../components/templates/SettingsTemplate";
import useSettings from "../hooks/useSettings";

const Settings = () => {
  const navigate = useNavigate();
  const {
    formData, setFormData,
    imagePreview, loading,
    openSnackbar, setOpenSnackbar,
    handleImageChange, handleSave,
  } = useSettings();

  return (
    <SettingsTemplate
      formData={formData}
      setFormData={setFormData}
      imagePreview={imagePreview}
      loading={loading}
      openSnackbar={openSnackbar}
      setOpenSnackbar={setOpenSnackbar}
      handleImageChange={handleImageChange}
      handleSave={handleSave}
      onBack={() => navigate("/users")}
    />
  );
};

export default Settings;