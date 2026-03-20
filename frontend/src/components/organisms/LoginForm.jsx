import AuthCard from "../atoms/AuthCard";          
import LoginFormFields from "../molecules/LoginFormFields";

const LoginForm = ({
  formData,
  setFormData,
  errors,
  onLogin,
  onNavigateSignup,
}) => {
  return (
    <AuthCard title="Login">                        
      <LoginFormFields
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onLogin={onLogin}
        onNavigateSignup={onNavigateSignup}
      />
    </AuthCard>
  );
};

export default LoginForm;