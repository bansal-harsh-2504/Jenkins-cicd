import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        message: "User not authenticated",
        success: false,
      });
    }
    let decode;
    try {
      decode = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.json({
          message: "User not Logged In",
          success: false,
        });
      }
      throw err;
    }
    const userId = decode.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid User",
        success: false,
      });
    }
    req.id = decode.userId;
    const user = await User.findById(req.id);
    if (!user) {
      res.json({
        message: "User not found. Invalid User!",
        success: false,
      });
      return;
    }
    next();
  } catch (err) {
    console.log("Error in protect route middleware. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export default protectRoute;
