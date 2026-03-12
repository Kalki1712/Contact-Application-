import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import { hashPassword } from "../utils/hashPassword";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/users");
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
      const hashedPw = await hashPassword(formData.password);

      const res = await axios.post("/auth/login", {
        email: formData.email,
        password: hashedPw,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("remainingSeconds", res.data.remainingSeconds); 
      localStorage.setItem("warnBeforeSec", res.data.warnBeforeSec);       
      localStorage.setItem("user", JSON.stringify({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        image: res.data.image,
      }));
      navigate("/users");

    } catch (err) {
      setErrors({ general: "Invalid credentials" });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center">Login</Typography>

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

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>

        <Typography textAlign="center" mt={2}>
          Don't have an account?
          <Button onClick={() => navigate("/signup")}>Sign Up</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;


// import { useState, useEffect } from "react";
// import { Box, TextField, Button, Typography, Paper } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosInstance";
// import { hashPassword } from "../utils/hashPassword";

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (localStorage.getItem("token")) navigate("/users");
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.email) newErrors.email = "Email required";
//     if (!formData.password) newErrors.password = "Password required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async () => {
//     if (!validate()) return;
//     try {
//       const hashedPw = await hashPassword(formData.password);

//       const res = await axios.post("/auth/login", {
//         email: formData.email,
//         password: hashedPw,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("expiresAt", res.data.expiresAt); // ✅ save expiresAt
//       localStorage.setItem("user", JSON.stringify({
//         id: res.data.id,
//         name: res.data.name,
//         email: res.data.email,
//         image: res.data.image,
//       }));
//       navigate("/users");

//     } catch (err) {
//       setErrors({ general: "Invalid credentials" });
//     }
//   };

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
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         />

//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           margin="normal"
//           error={!!errors.password}
//           helperText={errors.password}
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         />

//         {errors.general && (
//           <Typography color="error" textAlign="center" mt={1}>
//             {errors.general}
//           </Typography>
//         )}

//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
//           Login
//         </Button>

//         <Typography textAlign="center" mt={2}>
//           Don't have an account?
//           <Button onClick={() => navigate("/signup")}>Sign Up</Button>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default Login;






// import { useState, useEffect } from "react";
// import { Box, TextField, Button, Typography, Paper } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosInstance";
// import { hashPassword } from "../utils/hashPassword";

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (localStorage.getItem("token")) navigate("/users");
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.email) newErrors.email = "Email required";
//     if (!formData.password) newErrors.password = "Password required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async () => {
//     if (!validate()) return;
//     try {
//       const hashedPw = await hashPassword(formData.password);

//       const res = await axios.post("/auth/login", {
//         email: formData.email,
//         password: hashedPw,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify({
//         id: res.data.id,
//         name: res.data.name,
//         email: res.data.email,
//         image: res.data.image,
//       }));
//       navigate("/users");

//     } catch (err) {
//       setErrors({ general: "Invalid credentials" });
//     }
//   };

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
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         />

//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           margin="normal"
//           error={!!errors.password}
//           helperText={errors.password}
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         />

//         {errors.general && (
//           <Typography color="error" textAlign="center" mt={1}>
//             {errors.general}
//           </Typography>
//         )}

//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
//           Login
//         </Button>

//         <Typography textAlign="center" mt={2}>
//           Don't have an account?
//           <Button onClick={() => navigate("/signup")}>Sign Up</Button>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default Login;




