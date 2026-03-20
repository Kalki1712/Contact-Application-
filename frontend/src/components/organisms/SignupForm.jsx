import { Box } from "@mui/material";
import AuthCard from "../atoms/AuthCard";         
import AvatarUpload from "../molecules/AvatarUpload";
import SignupFormFields from "../molecules/SignupFormFields";

const SignupForm = ({
  formData,
  setFormData,
  errors,
  onSignup,
  onNavigateLogin,
  onImageChange,
}) => {
  return (
    <AuthCard title="Sign Up">                   
      <Box display="flex" justifyContent="center" mb={2}>
        <AvatarUpload
          imagePreview={
            formData.image ? URL.createObjectURL(formData.image) : ""
          }
          name={formData.name}
          onImageChange={onImageChange}
        />
      </Box>
      <SignupFormFields
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSignup={onSignup}
        onNavigateLogin={onNavigateLogin}
      />
    </AuthCard>
  );
};

export default SignupForm;