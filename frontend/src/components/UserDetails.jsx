import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 

const UserDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/users"; 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/details/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      } 
    }; 
    fetchUser();
  }, [id]); 

  if (loading) {
    return (
      <Box p={4}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          No user data found!
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to Users
      </Button>

      <Paper sx={{ mt: 3, p: 3, maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>
          User Details
        </Typography>

        {user.image && (
          <Box mb={2}>
            <img
              src={user.image}
              alt={user.name}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
        )}

        <Typography>
          <strong>Name:</strong> {user.name}
        </Typography>
        <Typography>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography>
          <strong>Gender:</strong> {user.gender}
        </Typography>
        <Typography>
          <strong>Contact:</strong> {user.countryCode} {user.contact}
        </Typography>
        <Typography>
          <strong>Country:</strong> {user.country}
        </Typography>
        <Typography>
          <strong>State:</strong> {user.state}
        </Typography>
        <Typography>
          <strong>City:</strong> {user.city}
        </Typography>

        <Typography mt={2}>
          <strong>Address:</strong>
        </Typography>
        <Typography
          sx={{
            whiteSpace: "pre-line",
            border: "1px solid #ccc",
            p: 1,
            borderRadius: 1,
          }}
        >
          {user.address}
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserDetails;



