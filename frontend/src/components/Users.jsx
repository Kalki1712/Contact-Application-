import { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper, 
  Select,
  MenuItem,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { Country, State, City } from "country-state-city";

const countryCodeMap = { India: "+91", USA: "+1", UK: "+44" };

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);


  const [loggedUserId] = useState(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id;
});


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    country: "",
    countryCode: "+91",
    contact: "",
    state: "",
    city: "",
    address: "",
    image: "",
    imageName: "",
  });

  const [errors, setErrors] = useState({});

  const API_URL = "http://localhost:5000/users";


  const loadUsers = async () => {
  if (!loggedUserId) return;

  try {
    const res = await axios.get(
      `${API_URL}/${loggedUserId}?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`
    );

    setUsers(res.data.users || []);
    setTotal(res.data.total || 0);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};


useEffect(() => {
  loadUsers();
  setCountries(Country.getAllCountries());
}, [loggedUserId, page, rowsPerPage, searchTerm]);

  
//   useEffect(() => {
//   if (!loggedUserId) return;

//   const loadUsers = async () => {
//     try {
//       const res = await axios.get(
//         `${API_URL}/${loggedUserId}?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`
//       );

//       setUsers(res.data.users || []);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   loadUsers();
//   setCountries(Country.getAllCountries());
// }, [loggedUserId, page, rowsPerPage, searchTerm]);


  console.log("Fetching users...");

   useEffect(() => {
    if (!formData.country) {
      setStatesList([]);
      setCitiesList([]);
      return;
    }

    const selectedCountry = countries.find(c => c.name === formData.country);
    if (!selectedCountry) return;

    const states = State.getStatesOfCountry(selectedCountry.isoCode);
    setStatesList(states);

    setFormData(prev => ({
      ...prev,
      countryCode: countryCodeMap[formData.country] || prev.countryCode
    }));

    if (formData.state) {
      const selectedState = states.find(s => s.name === formData.state);
      if (selectedState) {
        const cities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
        setCitiesList(cities);
      } else {
        setCitiesList([]);
      }
    } else {
      setCitiesList([]);
    }
  }, [formData.country, formData.state, countries]);



  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({
      name: "",
      email: "",
      gender: "",
      country: "",
      countryCode: "+91",
      contact: "",
      state: "",
      city: "",
      address: "",
      image: "",
      imageName: "",
    });
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (user) => {
    setIsEdit(true);
    setCurrentId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      country: user.country || "",
      countryCode: user.countryCode || "+91",
      contact: user.contact || "",
      state: user.state || "",
      city: user.city || "", 
      address: user.address || "",
      image: user.image || "",
      imageName: user.imageName || "",
    });
    setErrors({});
    setOpen(true);
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name required";
    if (!formData.email.trim()) {
      e.email = "Email required";
    } else if (!/\.(com|io)$/i.test(formData.email)) {
      e.email = "Email must end with .com or .io";
    }
    if (!formData.gender) e.gender = "Gender required";
    if (!formData.contact || formData.contact.length !== 10)
      e.contact = "10 digit contact required";
    if (!formData.country) e.country = "Country required";
    if (!formData.state) e.state = "State required";
    if (!formData.city) e.city = "City required";
    if (!formData.address.trim()) e.address = "Address required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const payload = {
      ...formData,
      ownerId: loggedUser.id, 
    };

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${currentId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      setOpen(false);
      // setPage(0); 
      await loadUsers(); 
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPage(0); 
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  console.log("Rendering users...");  
  
  return (
    <>
    

      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Button variant="contained" onClick={handleOpenAdd}>Add User</Button>

          <TextField
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            sx={{ width: 220 }}
          />
        </Box>

        <Paper>
          <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Profile Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>State</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell
                    sx={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", gap: 1 }}
                    onClick={() => navigate(`/user-details/${user.id}`)}
                  >
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name}
                        style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                      />
                    )}
                    {user.name}
                  </TableCell>

                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.countryCode} {user.contact}</TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell>{user.address}</TableCell>

                  <TableCell align="center">
                    <Button size="small" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(user.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Paper>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

   
      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={formData.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />

            <TextField
              label="Email"
              value={formData.email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />

            <Select
              value={formData.gender}
              displayEmpty
              onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <MenuItem value="" disabled>Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            {errors.gender && <Box color="error.main" fontSize="12px">{errors.gender}</Box>}

            {!formData.image ? (
              <Button component="label" variant="outlined">
                Upload Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setFormData(prev => ({ ...prev, image: reader.result, imageName: file.name }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
            ) : (
              <Box display="flex" alignItems="center" gap={2}>
                <Box fontSize="14px">{formData.imageName}</Box>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => setFormData(prev => ({ ...prev, image: "", imageName: "" }))}
                >
                  Delete
                </Button>
              </Box>
            )}

            <Box display="flex" gap={2}>
              <Select
                value={formData.countryCode}
                sx={{ width: 140 }}
                onChange={e => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
              >
                <MenuItem value="+91">+91 (India)</MenuItem>
                <MenuItem value="+1">+1 (USA)</MenuItem>
                <MenuItem value="+44">+44 (UK)</MenuItem>
              </Select>

              <TextField
                label="Contact Number"
                value={formData.contact}
                error={!!errors.contact}
                helperText={errors.contact}
                onChange={e => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                  setFormData(prev => ({ ...prev, contact: val }));
                }}
                fullWidth
              />
            </Box>

            <TextField
              label="Address"
              multiline
              rows={3}
              value={formData.address}
              error={!!errors.address}
              helperText={errors.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />

            <Autocomplete
              options={countries.map(c => c.name)}
              value={formData.country}
              onChange={(e, v) => setFormData(prev => ({ ...prev, country: v }))}
              renderInput={(params) => (
                <TextField {...params} label="Country" error={!!errors.country} helperText={errors.country} />
              )}
            />

            <Autocomplete
              options={statesList.map(s => s.name)}
              value={formData.state}
              onChange={(e, v) => setFormData(prev => ({ ...prev, state: v }))}
              renderInput={(params) => (
                <TextField {...params} label="State" error={!!errors.state} helperText={errors.state} />
              )}
            />

            <Autocomplete
              options={citiesList.map(c => c.name)}
              value={formData.city}
              onChange={(e, v) => setFormData(prev => ({ ...prev, city: v }))}
              renderInput={(params) => (
                <TextField {...params} label="City" error={!!errors.city} helperText={errors.city} />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">Cancel</Button>
          <Button onClick={handleSave} color="success">{isEdit ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Users;

