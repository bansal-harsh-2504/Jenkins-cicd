import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
  getLoggedInStatus,
  updateProfilePic,
  deleteUserData,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { singleUpload } from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.route("/register").post(singleUpload, register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter
  .route("/profile/update")
  .post(protectRoute, singleUpload, updateProfile);
userRouter.route("/getLoggedInStatus").get(protectRoute, getLoggedInStatus);
userRouter
  .route("/profile_picture/update")
  .post(protectRoute, singleUpload, updateProfilePic);
userRouter
  .route("/delete")
  .delete(protectRoute, deleteUserData);

export default userRouter;
