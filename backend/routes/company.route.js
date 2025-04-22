import express from "express";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { singleUpload } from "../middleware/multer.js";

const companyRouter = express.Router();

companyRouter.route("/register").post(protectRoute, registerCompany);
companyRouter.route("/get").get(protectRoute, getCompany);
companyRouter.route("/get/:id").get(protectRoute, getCompanyById);
companyRouter
  .route("/update/:id")
  .post(protectRoute, singleUpload, updateCompany);
companyRouter.route("/delete/:id").delete(protectRoute, deleteCompany);
export default companyRouter;
