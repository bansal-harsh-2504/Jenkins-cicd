import { Application, User } from "../models/export.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill in all the fields",
        success: false,
      });
    }
    const file = req.file;
    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const userId = req.id;
    let user = await User.findById(userId);

    if (user) {
      return res.status(400).json({
        message: "Email already exists.",
        success: false,
      });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fullName,
      email,
      phoneNumber: phoneNumber ? phoneNumber : 1111111111,
      password: hashedPassword,
      role,
      profile: {
        profilePic:
          cloudResponse?.secure_url || process.env.DEFAULT_PROFILE_URL,
        profilePicPublicId: cloudResponse?.public_id || null,
      },
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error in user sign in controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, role, password } = req.body;
    if (!email || !role || !password) {
      return res.status(400).json({
        message: "Please fill in all the fields",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials!",
        success: false,
      });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Invalid credentials!",
        success: false,
      });
    }
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 86400000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back ${user.fullName}`, user, success: true });
  } catch (err) {
    console.log("Error in user log in controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token").json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error in log out controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const skillsArr = skills ? skills.split(",") : undefined;
    const file = req.file;
    const userId = req.id;
    let user = await User.findOne({ email });
    if (user && user._id != userId) {
      res.json({
        message: "Email already exists",
        success: false,
      });
      return;
    }
    user = await User.findOne({ phoneNumber });
    if (user && user._id != userId) {
      res.json({
        message: "Phone number already exists",
        success: false,
      });
      return;
    }
    user = await User.findById({ _id: userId });
    if (!user) {
      res.json({
        message: "User does not exists",
        success: false,
      });
      return;
    }
    if (file) {
      if (user.profile.resumePublicId) {
        await cloudinary.uploader.destroy(user.profile.resumePublicId);
      }
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
      user.profile.resumePublicId = cloudResponse.public_id || null;
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber.length == 10) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArr;

    await user.save();
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (err) {
    console.log("Error updating user details. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.id;
    let user = await User.findById({ _id: userId });
    if (!user) {
      res.json({
        message: "User does not exists",
        success: false,
      });
      return;
    }
    if (file) {
      if (user.profile.profilePicPublicId) {
        await cloudinary.uploader.destroy(user.profile.profilePicPublicId);
      }
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.profilePic = cloudResponse.secure_url;
      user.profile.profilePicPublicId = cloudResponse.public_id || null;
    }

    await user.save();
    return res.status(200).json({
      message: "Profile Picture updated successfully",
      user,
      success: true,
    });
  } catch (err) {
    console.log("Error updating user details. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getLoggedInStatus = async (req, res) => {
  return res.status(200).json({
    message: "User is LoggedIn",
    success: true,
  });
};

export const deleteUserData = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.json({
        message: "User does not exists",
        success: false,
      });
      return;
    }
    await Application.deleteMany({ applicant: userId });
    await User.findOneAndDelete({ _id: userId });
    return res.status(200).json({
      message: "User and User Data deleted successfully",
      user,
      success: true,
    });
  } catch (err) {
    console.log("Error deleting user. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
