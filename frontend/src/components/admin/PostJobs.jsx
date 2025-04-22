import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/routesUrl";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import useGetJobById from "@/hooks/useGetJobById";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { setSingleJob } from "@/redux/jobSlice";

const AdminJobsSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const jobId = params.id;
  const [loading, setLoading] = useState(false);
  const [displayCompany, setDisplayCompany] = useState(true);

  useGetAllCompanies();
  useGetJobById(jobId);

  const { companies } = useSelector((store) => store.company);
  const { singleJob } = useSelector((store) => store.job);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "full-time",
    location: "",
    experience: "",
    position: "0",
    companyId: "",
    joiningDate: new Date().toISOString().split("T")[0],
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const validateInput = () => {
    for (let key in input) {
      if (input[key].trim() == "") {
        toast.error("Please fill in all the fields");
        return 1;
      }
    }
    return 0;
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (validateInput()) return;
    const formData = new FormData();
    for (const key in input) {
      formData.append(`${key}`, input[key]);
    }
    try {
      setLoading(true);
      let res;
      if (jobId) {
        res = await axios.put(`${JOB_API_ENDPOINT}/update/${jobId}`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${JOB_API_ENDPOINT}/post`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      }
      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        toast.success(res.data.message);
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (jobId) {
      setDisplayCompany(false);
      setInput({
        title: singleJob?.title || "",
        description: singleJob?.description || "",
        requirements: singleJob?.requirements || "",
        salary: singleJob?.salary || "",
        jobType: singleJob?.jobType || "full-time",
        location: singleJob?.location || "",
        experience: singleJob?.experience || "",
        position: singleJob?.position || "",
        companyId: singleJob?.company || "",
        joiningDate:
          singleJob?.joiningDate.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
    }
  }, [singleJob, jobId]);
  useEffect(() => {
    if (companies.length === 0) {
      navigate("/admin/companies");
    }
  }, [companies]);
  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 p-8">
            <Button
              onClick={() => navigate("/admin/jobs")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl">Job Details</h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Experience</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Position</Label>
              <Input
                type="text"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Joining Date</Label>
              <Input
                type="date"
                name="joiningDate"
                value={input.joiningDate}
                onChange={changeEventHandler}
                className="w-36"
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <RadioGroup className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="jobType"
                    id="r1"
                    value="full-time"
                    className="cursor-pointer"
                    checked={input.jobType === "full-time"}
                    onChange={changeEventHandler}
                  />
                  <Label
                    htmlFor="r1"
                    className="whitespace-nowrap cursor-pointer
"
                  >
                    Full time
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="jobType"
                    value="part-time"
                    className="cursor-pointer"
                    id="r2"
                    checked={input.jobType === "part-time"}
                    onChange={changeEventHandler}
                  />
                  <Label
                    htmlFor="r2"
                    className="whitespace-nowrap cursor-pointer
"
                  >
                    Part time
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="jobType"
                    value="internship"
                    className="cursor-pointer"
                    id="r3"
                    checked={input.jobType === "internship"}
                    onChange={changeEventHandler}
                  />
                  <Label htmlFor="r3" className="cursor-pointer">
                    Internship
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {displayCompany && (
              <div>
                <Label id="company">Select Company</Label>
                <br />
                <select
                  name="companyId"
                  id="company"
                  onChange={(e) => changeEventHandler(e)}
                  value={input.companyId}
                  className="mt-2"
                >
                  <option value="">Select a company</option>
                  {companies &&
                    companies.length > 0 &&
                    companies.map((company, idx) => {
                      return (
                        <option value={`${company._id}`} key={idx}>
                          {company.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
          </div>
          {loading ? (
            <Button className="w-full my-4">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              {jobId ? "Update" : "Create"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminJobsSetup;
