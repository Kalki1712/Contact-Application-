import { useState } from "react";
import axios from "../axiosInstance";
import { hashPassword } from "../utils/hashPassword";
import { useSession } from "../global/userSession";

const useSettings = () => {
  const { loggedUser, updateUser } = useSession();

  const [formData, setFormData] = useState({
    name: loggedUser?.name || "",
    email: loggedUser?.email || "",
    image: null,
    oldPassword: "",
    newPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(
    loggedUser?.image || ""
  );
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);

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

      const res = await axios.put(
        `/auth/profile/${loggedUser.id}`,
        data
      );

      updateUser(res.data);
      setImagePreview(res.data.image || "");
      setOpenSnackbar(true);
      setFormData(prev => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        image: null,
      }));

    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    imagePreview,
    loading,
    openSnackbar,
    setOpenSnackbar,
    handleImageChange,
    handleSave,
  };
};

export default useSettings;




// import { useState } from "react";
// import axios from "../axiosInstance";
// import { hashPassword } from "../utils/hashPassword";

// const useSettings = () => {

//   const [storedUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user"))
//   );

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

//   const handleImageChange = (file) => {
//     setFormData(prev => ({ ...prev, image: file }));
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("email", formData.email);

//       if (formData.oldPassword) {
//         const hashedOld = await hashPassword(formData.oldPassword);
//         data.append("oldPassword", hashedOld);
//       }
//       if (formData.newPassword) {
//         const hashedNew = await hashPassword(formData.newPassword);
//         data.append("newPassword", hashedNew);
//       }

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
//       setFormData(prev => ({
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

//   return {
//     formData, setFormData,
//     imagePreview, loading,
//     openSnackbar, setOpenSnackbar,
//     handleImageChange, handleSave,
//   };
// };

// export default useSettings;