import LoginForm from "../organisms/LoginForm";

const LoginTemplate = ({
  formData,
  setFormData,
  errors,
  onLogin, 
  onNavigateSignup,
}) => {
  return (
    <LoginForm
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      onLogin={onLogin}
      onNavigateSignup={onNavigateSignup}
    />
  );
};

export default LoginTemplate;