import { Company } from "../models/export.model.js";
import mongoose from "mongoose";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const userId = req.id;
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Please fill in all the fields",
        success: false,
      });
    }
    let company = await Company.findOne({
      name: companyName,
      userId,
    });
    if (company) {
      return res.status(400).json({
        message: "Company already registered.",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId,
      logo: process.env.DEFAULT_PROFILE_URL,
    });
    return res.status(201).json({
      message: "Company registered successfully",
      success: true,
      company,
    });
  } catch (err) {
    console.log("Error in register Company controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged in user id
    const companies = await Company.find({ userId });
    if (companies.length == 0) {
      return res.status(404).json({
        message: "No Company registered!",
        success: false,
      });
    }
    res.status(200).json({
      message: "Companies fetched successfully",
      success: true,
      companies,
    });
  } catch (err) {
    console.log("Error in get company controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.json({
        message: "Invalid company ID",
        success: false,
      });
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({
        message: "Invalid company ID",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (err) {
    console.log("Error in get Company by id controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Company ID",
        success: false,
      });
    }
    const { name, description, website, location } = req.body;
    const file = req.file;
    const userId = req.id;

    let company = await Company.findOne({ _id: id, userId });
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    company.name = name;
    company.description = description;
    company.website = website;
    company.location = location;
    if (file) {
      if (company.logoPublicId) {
        await cloudinary.uploader.destroy(company.logoPublicId);
      }
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      company.logo = cloudResponse.secure_url;
      company.logoPublicId = cloudResponse.public_id;
    }
    await company.save();

    return res.status(200).json({
      message: "Company information updated",
      success: true,
      data: company,
    });
  } catch (err) {
    console.log("Error in update company controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Company ID",
        success: false,
      });
    }

    let company = await Company.findOne({ _id: id, userId });
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    if (company.logoPublicId) {
      await cloudinary.uploader.destroy(company.logoPublicId);
    }
    await Company.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      message: "Company Deleted",
      success: true,
    });
  } catch (err) {
    console.log("Error in delete company controller. Error: ", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
