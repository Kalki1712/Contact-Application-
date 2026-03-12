import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Avatar, IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import { hashPassword } from "../utils/hashPassword";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/users");
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.email.trim()) {
      newErrors.email = "Email required";
    } else if (!/\.(com|io)$/i.test(formData.email)) {
      newErrors.email = "Enter valid email (.com or .io)";
    }
    if (!formData.password) {
      newErrors.password = "Password required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      const hashedPw = await hashPassword(formData.password);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", hashedPw);
      if (formData.image) data.append("image", formData.image);

      const res = await axios.post("/auth/signup", data);

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
      if (err.response?.status === 409) {
        setErrors({ email: err.response.data.message });
      } else {
        setErrors({ general: "Signup failed" });
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 350 }}>

        <Box display="flex" justifyContent="center" mb={2}>
          <Box position="relative">
            <Avatar
              src={formData.image ? URL.createObjectURL(formData.image) : undefined}
              sx={{ width: 90, height: 90 }}
            />
            <IconButton component="label">
              <CameraAltIcon fontSize="small" />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setFormData({ ...formData, image: file });
                }}
              />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h5" textAlign="center">Sign Up</Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

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

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSignup}>
          Create Account
        </Button>

        <Typography textAlign="center" mt={2}>
          Already have an account?
          <Button onClick={() => navigate("/login")}>Login</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;



// import { useState, useEffect } from "react";
// import { Box, TextField, Button, Typography, Paper, Avatar, IconButton } from "@mui/material";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosInstance";
// import { hashPassword } from "../utils/hashPassword";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     image: null,
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (localStorage.getItem("token")) navigate("/users");
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name required";
//     if (!formData.email.trim()) {
//       newErrors.email = "Email required";
//     } else if (!/\.(com|io)$/i.test(formData.email)) {
//       newErrors.email = "Enter valid email (.com or .io)";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSignup = async () => {
//     if (!validate()) return;
//     try {
//       const hashedPw = await hashPassword(formData.password);

//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("email", formData.email);
//       data.append("password", hashedPw);
//       if (formData.image) data.append("image", formData.image);

//       const res = await axios.post("/auth/signup", data);

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("expiresAt", res.data.expiresAt);
//       localStorage.setItem("user", JSON.stringify({
//         id: res.data.id,
//         name: res.data.name,
//         email: res.data.email,
//         image: res.data.image,
//       }));
//       navigate("/users");

//     } catch (err) {
//       if (err.response?.status === 409) {
//         setErrors({ email: err.response.data.message });
//       } else {
//         setErrors({ general: "Signup failed" });
//       }
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//       <Paper sx={{ p: 4, width: 350 }}>

//         <Box display="flex" justifyContent="center" mb={2}>
//           <Box position="relative">
//             <Avatar
//               src={formData.image ? URL.createObjectURL(formData.image) : undefined}
//               sx={{ width: 90, height: 90 }}
//             />
//             <IconButton component="label">
//               <CameraAltIcon fontSize="small" />
//               <input
//                 hidden
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (file) setFormData({ ...formData, image: file });
//                 }}
//               />
//             </IconButton>
//           </Box>
//         </Box>

//         <Typography variant="h5" textAlign="center">Sign Up</Typography>

//         <TextField
//           label="Name"
//           fullWidth
//           margin="normal"
//           error={!!errors.name}
//           helperText={errors.name}
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//         />

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

//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSignup}>
//           Create Account
//         </Button>

//         <Typography textAlign="center" mt={2}>
//           Already have an account?
//           <Button onClick={() => navigate("/login")}>Login</Button>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default Signup;


// import { useState, useEffect } from "react";
// import { Box, TextField, Button, Typography, Paper, Avatar, IconButton } from "@mui/material";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosInstance";
// import { hashPassword } from "../utils/hashPassword";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     image: null,
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (localStorage.getItem("token")) navigate("/users");
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name required";
//     if (!formData.email.trim()) {
//       newErrors.email = "Email required";
//     } else if (!/\.(com|io)$/i.test(formData.email)) {
//       newErrors.email = "Enter valid email (.com or .io)";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSignup = async () => {
//     if (!validate()) return;
//     try {
//       const hashedPw = await hashPassword(formData.password);

//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("email", formData.email);
//       data.append("password", hashedPw);
//       if (formData.image) data.append("image", formData.image);

//       const res = await axios.post("/auth/signup", data);

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify({
//         id: res.data.id,
//         name: res.data.name,
//         email: res.data.email,
//         image: res.data.image,
//       }));
//       navigate("/users");

//     } catch (err) {
//       if (err.response?.status === 409) {
//         setErrors({ email: err.response.data.message });
//       } else {
//         setErrors({ general: "Signup failed" });
//       }
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//       <Paper sx={{ p: 4, width: 350 }}>

//         <Box display="flex" justifyContent="center" mb={2}>
//           <Box position="relative">
//             <Avatar
//               src={formData.image ? URL.createObjectURL(formData.image) : undefined}
//               sx={{ width: 90, height: 90 }}
//             />
//             <IconButton component="label">
//               <CameraAltIcon fontSize="small" />
//               <input
//                 hidden
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (file) setFormData({ ...formData, image: file });
//                 }}
//               />
//             </IconButton>
//           </Box>
//         </Box>

//         <Typography variant="h5" textAlign="center">Sign Up</Typography>

//         <TextField
//           label="Name"
//           fullWidth
//           margin="normal"
//           error={!!errors.name}
//           helperText={errors.name}
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//         />

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

//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSignup}>
//           Create Account
//         </Button>

//         <Typography textAlign="center" mt={2}>
//           Already have an account?
//           <Button onClick={() => navigate("/login")}>Login</Button>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default Signup;



