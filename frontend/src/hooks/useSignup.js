import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import { hashPassword } from "../utils/hashPassword";

const useSignup = () => {
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

  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  return { formData, setFormData, errors, handleSignup, handleImageChange };
};

export default useSignup;