import express from "express";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const applicationRouter = express.Router();

applicationRouter.route("/apply/:id").get(protectRoute, applyJob);
applicationRouter.route("/get").get(protectRoute, getAppliedJobs);
applicationRouter.route("/:id/applicants").get(protectRoute, getApplicants);
applicationRouter.route("/status/:id/update").post(protectRoute, updateStatus);

export default applicationRouter;
