import { useState } from "react";
import axios from "../axiosInstance";
import { hashPassword } from "../utils/hashPassword";
import { useSession } from "../global/userSession";

const useLogin = () => {
  const { login } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email required"; 
    if (!formData.password) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  console.log("useLogin formData:", formData);
  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const hashedPw = await hashPassword(formData.password);
      const res = await axios.post("/auth/login", {
        email: formData.email,
        password: hashedPw,
      });
      login(res.data);
    } catch (err) {
      setErrors({ general: "Invalid credentials" });
    }
  };

  return { formData, setFormData, errors, handleLogin };
};

export default useLogin;





// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosInstance";
// import { hashPassword } from "../utils/hashPassword";

// const useLogin = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

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
//       localStorage.setItem("remainingSeconds", res.data.remainingSeconds);
//       localStorage.setItem("warnBeforeSec", res.data.warnBeforeSec);
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

//   return { formData, setFormData, errors, handleLogin };
// };

// export default useLogin;