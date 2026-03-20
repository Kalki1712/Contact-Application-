import { TextField } from "@mui/material";

const SettingsFormFields = ({ formData, setFormData }) => {
  return (
    <>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField
        label="Old Password"
        type="password"
        fullWidth
        margin="normal"
        value={formData.oldPassword}
        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
      />
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        helperText="Minimum 6 characters"
        value={formData.newPassword}
        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
      />
    </>
  );
};

export default SettingsFormFields;