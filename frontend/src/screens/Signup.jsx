import { useNavigate } from "react-router-dom";
import SignupTemplate from "../components/templates/SignupTemplate";
import useSignup from "../hooks/useSignup";

const Signup = () => {
  const navigate = useNavigate();
  const { formData, setFormData, errors, handleSignup, handleImageChange } = useSignup();

  return (
    <SignupTemplate
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      onSignup={handleSignup}
      onNavigateLogin={() => navigate("/login")}
      onImageChange={handleImageChange}
    />
  );
};

export default Signup;




