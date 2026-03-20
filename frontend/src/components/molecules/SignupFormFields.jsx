import { TextField, Button, Typography } from "@mui/material";

const SignupFormFields = ({
  formData, setFormData, errors,
  onSignup, onNavigateLogin,
}) => {
  return (
    <>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.general && (
        <Typography color="error" textAlign="center" mt={1}>
          {errors.general}
        </Typography>
      )}
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={onSignup}>
        Create Account
      </Button>
      <Typography textAlign="center" mt={2}>
        Already have an account?
        <Button onClick={onNavigateLogin}>Login</Button>
      </Typography>
    </>
  );
};

export default SignupFormFields;