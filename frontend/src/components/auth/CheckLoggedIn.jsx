import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/routesUrl";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CheckLoggedIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err);
    }
  };
  const getLoggedInStatus = async () => {
    try {
      if (user) {
        const res = await axios.get(`${USER_API_ENDPOINT}/getLoggedInStatus`, {
          withCredentials: true,
        });
        if (res.data.success == false) {
          logoutHandler();
        }
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getLoggedInStatus();
  }, []);
  return null;
};

export default CheckLoggedIn;
