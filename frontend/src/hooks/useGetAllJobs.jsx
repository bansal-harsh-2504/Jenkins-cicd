import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/routesUrl";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  const fetchAllJobs = async () => {
    try {
      const res = await axios.get(
        `${JOB_API_ENDPOINT}/get?keyword=${searchedQuery}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
      } else {
        dispatch(setAllJobs([]));
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchAllJobs();
  }, []);
};

export default useGetAllJobs;
