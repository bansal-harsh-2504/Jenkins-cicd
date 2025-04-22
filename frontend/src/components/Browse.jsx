import { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "../hooks/useGetAllJobs";
import CheckLoggedIn from "./auth/CheckLoggedIn";

const Browse = () => {
  useGetAllJobs();

  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    return () => {
      setQuery(searchedQuery);
      dispatch(setSearchedQuery(""));
    };
  }, []);

  return (
    <div>
      <CheckLoggedIn />
      <Navbar />
      {user ? (
        <div className="max-w-7xl mx-auto my-10">
          <h1 className="font-bold text-xl my-10">
            Search Results ({allJobs.length})
          </h1>
          <div className="grid grid-cols-3 gap-4">
            {allJobs?.length ? (
              allJobs.map((job) => {
                return <Job key={job._id} job={job} />;
              })
            ) : (
              <span>No Jobs found for &quot;{query}&quot;</span>
            )}
          </div>
        </div>
      ) : (
        <h1>Log In to View</h1>
      )}
    </div>
  );
};

export default Browse;
