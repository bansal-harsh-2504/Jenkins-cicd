import CheckLoggedIn from "../auth/CheckLoggedIn";
import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "../../redux/jobSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminJobs = () => {
  const navigate = useNavigate();
  <CheckLoggedIn />;
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);

  const handleClick = () => {
    if (companies.length == 0) {
      toast.error("Please register a company first");
      return;
    }
    navigate("/admin/jobs/create");
  };
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleClick}>New Jobs</Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  );
};

export default AdminJobs;
