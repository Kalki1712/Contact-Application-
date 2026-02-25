import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      navigate("/");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    // if (!formData.email.trim()) newErrors.email = "Email required";
     if (!formData.email.trim()) {
          newErrors.email = "Email required";
           } else if (!/\.(com|io)$/i.test(formData.email)) {
            newErrors.email = "Enter valid sentence";
          }

    // if (!formData.password) newErrors.password = "Password required";

    if (!formData.password) {
  newErrors.password = "Password required";
} else if (formData.password.length < 6) {
  newErrors.password = "Password must be at least 6 characters";
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/signup",
        formData
      );

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ email: err.response.data.message });
      } else {
        setErrors({ general: "Signup failed" });
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, width: 350 }}>
        
        <Box display="flex" justifyContent="center" mb={2}>
          <Box position="relative">
            <Avatar
              src={formData.image || undefined}
              component="label"
              sx={{
                width: 90,
                height: 90,
                cursor: "pointer",
              }}
            >
              {/* {!formData.image && formData.name?.[0]?.toUpperCase()} */}

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Avatar>

          
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "background.paper",
                boxShadow: 1
              }}
            >
              <CameraAltIcon fontSize="small" />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h5" textAlign="center">
          Sign Up
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {errors.general && (
          <Typography color="error" textAlign="center" mt={1}>
            {errors.general}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSignup}
        >
          Create Account
        </Button>

        <Typography textAlign="center" mt={2}>
          Already have an account?{" "}
          <Button onClick={() => navigate("/login")}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;



 // its an only stored in local storage signup without backend

  // const handleSignup = () => {
  //   if (!validate()) return;
  //   localStorage.setItem("user", JSON.stringify(formData));
  //   localStorage.setItem("isLoggedIn", "true");
  //    navigate("/users"); 
  //   // navigate("/");
  // };

