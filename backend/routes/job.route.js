import express from "express";
import {
  deleteAllJobs,
  deleteJobById,
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJobById,
} from "../controllers/job.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const jobRouter = express.Router();

jobRouter.route("/post").post(protectRoute, postJob);
jobRouter.route("/get").get(protectRoute, getAllJobs);
jobRouter.route("/getadminjobs").get(protectRoute, getAdminJobs);
jobRouter.route("/get/:id").get(protectRoute, getJobById);
jobRouter.route("/update/:id").put(protectRoute, updateJobById);
jobRouter.route("/delete/:id").delete(protectRoute, deleteJobById);
jobRouter.route("/delete/all/:companyId").delete(protectRoute, deleteAllJobs);

export default jobRouter;
