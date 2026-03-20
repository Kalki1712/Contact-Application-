import SignupForm from "../organisms/SignupForm";

const SignupTemplate = ({
  formData, 
  setFormData,
  errors,
  onSignup,
  onNavigateLogin,
  onImageChange,
}) => {
  return (
    <SignupForm
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      onSignup={onSignup}
      onNavigateLogin={onNavigateLogin}
      onImageChange={onImageChange}
    />
  );
};

export default SignupTemplate;