import { useState, useEffect } from "react";
import axios from "../axiosInstance";
import { Country, State, City } from "country-state-city";
import { useSession } from "../global/userSession";

const countryCodeMap = { India: "+91", USA: "+1", UK: "+44" };

const useUsers = () => {
  const { loggedUser } = useSession();
  const loggedUserId = loggedUser?.id;

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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
    image: null,
    imageName: "",
  });

  const [errors, setErrors] = useState({});

  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const API_URL = "/users";

  useEffect(() => {
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
    loadUsers();
    setCountries(Country.getAllCountries());
  }, [loggedUserId, page, rowsPerPage, searchTerm]);

  const refreshUsers = async () => {
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
      countryCode: countryCodeMap[formData.country] || prev.countryCode,
    }));

    if (formData.state) {
      const selectedState = states.find(s => s.name === formData.state);
      if (selectedState) {
        const cities = City.getCitiesOfState(
          selectedCountry.isoCode,
          selectedState.isoCode
        );
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
      image: null,
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
      image: user.image || null,
      imageName: "",
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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("gender", formData.gender);
    data.append("country", formData.country);
    data.append("countryCode", formData.countryCode);
    data.append("contact", formData.contact);
    data.append("state", formData.state);
    data.append("city", formData.city);
    data.append("address", formData.address);
    data.append("ownerId", loggedUserId);

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    } else if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${currentId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      setOpen(false);
      await refreshUsers();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteTargetId}`);
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      setPage(0);
      await refreshUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return {
    users, total, page, rowsPerPage,
    searchTerm, setSearchTerm,
    handleChangePage, handleChangeRowsPerPage,
    open, setOpen, isEdit,
    handleOpenAdd, handleEdit, handleSave,
    formData, setFormData, errors,
    deleteDialogOpen, setDeleteDialogOpen,
    handleDeleteClick, handleDeleteConfirm,
    countries, statesList, citiesList,
  };
};

export default useUsers;






// import { useState, useEffect } from "react";
// import axios from "../axiosInstance";
// import { Country, State, City } from "country-state-city";

// const countryCodeMap = { India: "+91", USA: "+1", UK: "+44" };

// const useUsers = () => {

//   const [users, setUsers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [total, setTotal] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [open, setOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [currentId, setCurrentId] = useState(null);

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteTargetId, setDeleteTargetId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     gender: "",
//     country: "",
//     countryCode: "+91",
//     contact: "",
//     state: "",
//     city: "",
//     address: "",
//     image: null,
//     imageName: "",
//   });

//   const [errors, setErrors] = useState({});

//   const [countries, setCountries] = useState([]);
//   const [statesList, setStatesList] = useState([]);
//   const [citiesList, setCitiesList] = useState([]);

//   const [loggedUserId] = useState(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.id;
//   });

//   const API_URL = "/users";

//   useEffect(() => {
//     const loadUsers = async () => {
//       if (!loggedUserId) return;
//       try {
//         const res = await axios.get(
//           `${API_URL}/${loggedUserId}?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`
//         );
//         setUsers(res.data.users || []);
//         setTotal(res.data.total || 0);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };
//     loadUsers();
//     setCountries(Country.getAllCountries());
//   }, [loggedUserId, page, rowsPerPage, searchTerm]);

//   const refreshUsers = async () => {
//     if (!loggedUserId) return;
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

//   useEffect(() => {
//     if (!formData.country) {
//       setStatesList([]);
//       setCitiesList([]);
//       return;
//     }
//     const selectedCountry = countries.find(c => c.name === formData.country);
//     if (!selectedCountry) return;

//     const states = State.getStatesOfCountry(selectedCountry.isoCode);
//     setStatesList(states);

//     setFormData(prev => ({
//       ...prev,
//       countryCode: countryCodeMap[formData.country] || prev.countryCode,
//     }));

//     if (formData.state) {
//       const selectedState = states.find(s => s.name === formData.state);
//       if (selectedState) {
//         const cities = City.getCitiesOfState(
//           selectedCountry.isoCode,
//           selectedState.isoCode
//         );
//         setCitiesList(cities);
//       } else {
//         setCitiesList([]);
//       }
//     } else {
//       setCitiesList([]);
//     }
//   }, [formData.country, formData.state, countries]);

//   const handleOpenAdd = () => {
//     setIsEdit(false);
//     setFormData({
//       name: "",
//       email: "",
//       gender: "",
//       country: "",
//       countryCode: "+91",
//       contact: "",
//       state: "",
//       city: "",
//       address: "",
//       image: null,
//       imageName: "",
//     });
//     setErrors({});
//     setOpen(true);
//   };

//   const handleEdit = (user) => {
//     setIsEdit(true);
//     setCurrentId(user.id);
//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       gender: user.gender || "",
//       country: user.country || "",
//       countryCode: user.countryCode || "+91",
//       contact: user.contact || "",
//       state: user.state || "",
//       city: user.city || "",
//       address: user.address || "",
//       image: user.image || null,
//       imageName: "",
//     });
//     setErrors({});
//     setOpen(true);
//   };

//   const validateForm = () => {
//     const e = {};
//     if (!formData.name.trim()) e.name = "Name required";
//     if (!formData.email.trim()) {
//       e.email = "Email required";
//     } else if (!/\.(com|io)$/i.test(formData.email)) {
//       e.email = "Email must end with .com or .io";
//     }
//     if (!formData.gender) e.gender = "Gender required";
//     if (!formData.contact || formData.contact.length !== 10)
//       e.contact = "10 digit contact required";
//     if (!formData.country) e.country = "Country required";
//     if (!formData.state) e.state = "State required";
//     if (!formData.city) e.city = "City required";
//     if (!formData.address.trim()) e.address = "Address required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     const loggedUser = JSON.parse(localStorage.getItem("user"));

//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     data.append("gender", formData.gender);
//     data.append("country", formData.country);
//     data.append("countryCode", formData.countryCode);
//     data.append("contact", formData.contact);
//     data.append("state", formData.state);
//     data.append("city", formData.city);
//     data.append("address", formData.address);
//     data.append("ownerId", loggedUser.id);

//     if (formData.image instanceof File) {
//       data.append("image", formData.image);
//     } else if (formData.image) {
//       data.append("image", formData.image);
//     }

//     try {
//       if (isEdit) {
//         await axios.put(`${API_URL}/${currentId}`, data);
//       } else {
//         await axios.post(API_URL, data);
//       }
//       setOpen(false);
//       await refreshUsers();
//     } catch (err) {
//       console.error("Save error:", err);
//     }
//   };

//   const handleDeleteClick = (id) => {
//     setDeleteTargetId(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await axios.delete(`${API_URL}/${deleteTargetId}`);
//       setDeleteDialogOpen(false);
//       setDeleteTargetId(null);
//       setPage(0);
//       await refreshUsers();
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   const handleChangePage = (e, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (e) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     setPage(0);
//   };

//   return {
//     users, total, page, rowsPerPage,
//     searchTerm, setSearchTerm,
//     handleChangePage, handleChangeRowsPerPage,
//     open, setOpen, isEdit,
//     handleOpenAdd, handleEdit, handleSave,
//     formData, setFormData, errors,
//     deleteDialogOpen, setDeleteDialogOpen,
//     handleDeleteClick, handleDeleteConfirm,
//     countries, statesList, citiesList,
//   };
// };

// export default useUsers;