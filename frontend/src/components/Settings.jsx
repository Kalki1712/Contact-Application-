import { useState } from "react";
import {
  Box, TextField, Button, Paper, Avatar,
  Typography, IconButton, Snackbar, Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import { hashPassword } from "../utils/hashPassword";

const Settings = () => {
  const navigate = useNavigate();

  const [storedUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    image: null,
    oldPassword: "",
    newPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(storedUser?.image || "");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
 
  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);

      //   Hash passwords only if provided
      if (formData.oldPassword) {
        const hashedOld = await hashPassword(formData.oldPassword);
        data.append("oldPassword", hashedOld);
      }
      if (formData.newPassword) {
        const hashedNew = await hashPassword(formData.newPassword);
        data.append("newPassword", hashedNew);
      }

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      } else {
        data.append("image", imagePreview || "");
      }

      const res = await axios.put(`/auth/profile/${storedUser.id}`, data);

      localStorage.setItem("user", JSON.stringify(res.data));
      setImagePreview(res.data.image || "");
      window.dispatchEvent(new Event("userUpdated"));
      setOpenSnackbar(true);
      setFormData(prev => ({ ...prev, oldPassword: "", newPassword: "", image: null }));

    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate("/users")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">Settings</Typography>
      </Box>

      <Box display="flex" justifyContent="center">
        <Paper sx={{ p: 4, width: 420 }}>

          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar src={imagePreview} sx={{ width: 90, height: 90, mb: 1 }}>
              {!imagePreview && formData.name?.[0]}
            </Avatar>
            <Button variant="outlined" component="label">
              Change Image
              <input
                hidden
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setFormData(prev => ({ ...prev, image: file }));
                  setImagePreview(URL.createObjectURL(file));
                }}
              />
            </Button>
          </Box>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <TextField
            label="Old Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.oldPassword}
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            helperText="Minimum 6 characters"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Update"}
          </Button>
        </Paper>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;


// import { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Paper,
//   Avatar,
//   Typography,
//   IconButton,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosInstance";

// const Settings = () => {
//   const navigate = useNavigate();

//   const [storedUser] = useState(() => JSON.parse(localStorage.getItem("user")));

//   const [formData, setFormData] = useState({
//     name: storedUser?.name || "",
//     email: storedUser?.email || "",
//     image: null,
//     oldPassword: "",
//     newPassword: "",
//   });

//   const [imagePreview, setImagePreview] = useState(storedUser?.image || "");
//   const [loading, setLoading] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("email", formData.email);
//       data.append("oldPassword", formData.oldPassword);
//       data.append("newPassword", formData.newPassword);

//       if (formData.image instanceof File) {
//         data.append("image", formData.image);
//       } else {
//         data.append("image", imagePreview || "");
//       }

//       const res = await axios.put(`/auth/profile/${storedUser.id}`, data);

//       localStorage.setItem("user", JSON.stringify(res.data));
//       setImagePreview(res.data.image || "");
//       window.dispatchEvent(new Event("userUpdated"));
//       setOpenSnackbar(true);
//       setFormData((prev) => ({
//         ...prev,
//         oldPassword: "",
//         newPassword: "",
//         image: null,
//       }));

//     } catch (err) {
//       alert(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box p={4}>
//       <Box display="flex" alignItems="center" mb={4}>
//         <IconButton onClick={() => navigate("/users")}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h5" fontWeight="bold">
//           Settings
//         </Typography>
//       </Box>

//       <Box display="flex" justifyContent="center">
//         <Paper sx={{ p: 4, width: 420 }}>

//           <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
//             <Avatar src={imagePreview} sx={{ width: 90, height: 90, mb: 1 }}>
//               {!imagePreview && formData.name?.[0]}
//             </Avatar>

//             <Button variant="outlined" component="label">
//               Change Image
//               <input
//                 hidden
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;
//                   setFormData((prev) => ({ ...prev, image: file }));
//                   setImagePreview(URL.createObjectURL(file));
//                 }}
//               />
//             </Button>
//           </Box>

//           <TextField
//             label="Name"
//             fullWidth
//             margin="normal"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           />

//           <TextField
//             label="Email"
//             fullWidth
//             margin="normal"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           />

//           <TextField
//             label="Old Password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={formData.oldPassword}
//             onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
//           />

//           <TextField
//             label="New Password"
//             type="password"
//             fullWidth
//             margin="normal"
//             helperText="Minimum 6 characters"
//             value={formData.newPassword}
//             onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
//           />

//           <Button
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3 }}
//             disabled={loading}
//             onClick={handleSave}
//           >
//             {loading ? "Saving..." : "Update"}
//           </Button>
//         </Paper>
//       </Box>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
//           Profile updated successfully!
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Settings;