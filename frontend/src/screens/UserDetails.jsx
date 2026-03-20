import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserDetailsTemplate from "../components/templates/UserDetailsTemplate";
import axios from "../axiosInstance";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/details/${id}`);
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

  return (
    <UserDetailsTemplate
      user={user}
      loading={loading}
      onBack={() => navigate("/users")}
    />
  );
};

export default UserDetails;