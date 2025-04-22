import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/routesUrl";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const fetchAllAdminJobs = async () => {
    try {
      const res = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAllAdminJobs(res.data.jobs));
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchAllAdminJobs();
  }, []);
};

export default useGetAllAdminJobs;
