import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      navigate("/users");
    }
  }, [navigate]);


  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.password) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        formData
      );

      const authUser = res.data;

      // const profileRes = await axios.get(
      //   `http://localhost:5000/users/${authUser.id}`
      // );

      // const fullUser = {
      //   ...authUser,
      //   image: profileRes.data?.image || "",
      // };

     
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(authUser));

    
      navigate("/users");
    } catch (err) {
      setErrors({ general: "Invalid credentials" });
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
        <Typography variant="h5" textAlign="center">
          Login
        </Typography>

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
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography textAlign="center" mt={2}>
          Don’t have an account?
          <Button onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;




//this code no add profilemenu

// import { useState, useEffect } from "react";
// import { Box, TextField, Button, Typography, Paper } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; 

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (localStorage.getItem("isLoggedIn")) navigate("/");
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.email) newErrors.email = "Email required";
//     if (!formData.password) newErrors.password = "Password required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };



// const handleLogin = async () => {
//   if (!validate()) return;

//   try {
//     const res = await axios.post(
//       "http://localhost:5000/auth/login",
//       formData
//     );

//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("user", JSON.stringify(res.data)); 

//     navigate("/");
//   } catch (err) {
//     setErrors({ general: "Invalid credentials" });
//   }
// };


//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//       <Paper sx={{ p: 4, width: 350 }}>
//         <Typography variant="h5" textAlign="center">Login</Typography>
//         <TextField
//           label="Email"
//           fullWidth
//           margin="normal"
//           error={!!errors.email}
//           helperText={errors.email}
//           value={formData.email}
//           onChange={e => setFormData({ ...formData, email: e.target.value })}
//         />
//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           margin="normal"
//           error={!!errors.password}
//           helperText={errors.password}
//           value={formData.password}
//           onChange={e => setFormData({ ...formData, password: e.target.value })}
//         />
//         {errors.general && <Typography color="error" textAlign="center">{errors.general}</Typography>}
//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
//         <Typography textAlign="center" mt={2}>
//           Don’t have an account? <Button onClick={() => navigate("/signup")}>Sign Up</Button>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default Login;



  //its an only stored in local storage login without backend

  // const handleLogin = () => {
  //   if (!validate()) return;
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   if (!storedUser || storedUser.email !== formData.email || storedUser.password !== formData.password) {
  //     setErrors({ general: "Invalid credentials" });
  //     return;
  //   }
  //   localStorage.setItem("isLoggedIn", "true");
  //    navigate("/users"); 
  //   // navigate("/");
  // };

