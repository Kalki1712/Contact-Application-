import { TextField, Button, Typography } from "@mui/material";

const LoginFormFields = ({
  formData, setFormData, errors,
  onLogin, onNavigateSignup,
}) => {
  return (
    <>
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
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={onLogin}>
        Login
      </Button>
      <Typography textAlign="center" mt={2}>
        Don't have an account?
        <Button onClick={onNavigateSignup}>Sign Up</Button>
      </Typography>
    </>
  );
};

export default LoginFormFields;