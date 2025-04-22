import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckLoggedIn from "../auth/CheckLoggedIn";
import axios from "axios";
import { JOB_API_ENDPOINT } from "../../utils/routesUrl";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { setAllAdminJobs } from "@/redux/jobSlice";

const AdminJobsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const [debouncedSearchText, setDebouncedSearchText] =
    useState(searchJobByText);

  const handleDelete = async (jobId) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${JOB_API_ENDPOINT}/delete/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedJobs = allAdminJobs.filter((job) => job._id !== jobId);
        dispatch(setAllAdminJobs(updatedJobs));
        toast.success("Job deleted Successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchJobByText);
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [searchJobByText]);

  useEffect(() => {
    const filteredJobs =
      allAdminJobs.length >= 0 &&
      allAdminJobs.filter((job) => {
        if (!debouncedSearchText) {
          return true;
        }
        return (
          job?.title
            ?.toLowerCase()
            .includes(debouncedSearchText.toLowerCase()) ||
          job?.company?.name
            ?.toLowerCase()
            .includes(debouncedSearchText.toLowerCase())
        );
      });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, debouncedSearchText]);

  return (
    <div>
      <CheckLoggedIn />
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Posted on Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job, idx) => (
            <tr key={idx}>
              <TableCell>{job.company?.name}</TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                    <div className="flex items-center gap-2 w-fit cursor-pointer">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <div className="flex gap-2 items-center">
                              <Trash className="w-4" />
                              <span>Delete</span>
                            </div>
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
                            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                                Confirm
                              </Dialog.Title>
                              <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                                Are you sure you want to delete the job?
                                <br /> These changes are permanent
                              </Dialog.Description>
                              <div className="mt-[25px] flex justify-end">
                                <Dialog.Close asChild>
                                  <button
                                    className="text-white bg-[#DC3545] focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                                    onClick={() => handleDelete(job._id)}
                                  >
                                    Delete
                                  </button>
                                </Dialog.Close>
                              </div>
                              <Dialog.Close asChild>
                                <button
                                  className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                                  aria-label="Close"
                                >
                                  <Cross2Icon />
                                </button>
                              </Dialog.Close>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog.Root>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
