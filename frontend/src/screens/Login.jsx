import { useNavigate } from "react-router-dom";
import LoginTemplate from "../components/templates/LoginTemplate";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const navigate = useNavigate();
  const { formData, setFormData, errors, handleLogin } = useLogin();

  return (
    <LoginTemplate
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      onLogin={handleLogin}
      onNavigateSignup={() => navigate("/signup")}
    />
  );
};

export default Login;