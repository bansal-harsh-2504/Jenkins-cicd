import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

//Applicants

export const postJob = async (req, res) => {
  const adminId = req.id;
  const user = await User.findById({ _id: adminId });
  if (user.role !== "recruiter") {
    return res.status(404).json({
      message: "Jobs can be posted by recruitors only.",
      success: false,
    });
  }
  try {
    const {
      title,
      description,
      requirements,
      salary,
      jobType,
      location,
      experience,
      position,
      joiningDate,
      companyId,
    } = req.body;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !jobType ||
      !location ||
      !experience ||
      !position ||
      !companyId ||
      !joiningDate
    ) {
      return res.status(404).json({
        message: "Please fill in all the fields",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      joiningDate,
      company: companyId,
      created_by: adminId,
    });
    await job.save();

    return res.status(200).json({
      message: "New job created successfully",
      success: true,
      job,
    });
  } catch (err) {
    console.log("Error in post Job controller. Error: ", err);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs.length) {
      return res.json({
        message: "Jobs not found",
        success: false,
      });
    }
    return res.json({
      jobs,
      success: true,
    });
  } catch (err) {
    console.log("Error in getting all jobs controller. Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID",
        success: false,
      });
    }
    const job = await Job.findById(jobId).populate({ path: "applications" });
    if (!job) {
      return res.send(404).json({
        message: "Invalid Job ID",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (err) {
    console.log("Error in getting job by id controller. Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//Recruiters

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs.length) {
      return res.json({
        message: "No Job posted Yet",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (err) {
    console.log("Error in getting all jobs for admin controller. Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateJobById = async (req, res) => {
  try {
    const adminId = req.id;
    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID",
        success: false,
      });
    }
    const user = await User.findById({ _id: adminId });
    if (user.role !== "recruiter") {
      return res.status(404).json({
        message: "Jobs can be updated by recruitors only.",
        success: false,
      });
    }
    let job = await Job.findOne({
      created_by: adminId,
      _id: jobId,
    });

    if (!job) {
      return res.json({
        message: "Job does not exist",
        success: false,
      });
    }
    const {
      title,
      description,
      requirements,
      salary,
      jobType,
      location,
      experience,
      position,
      joiningDate,
    } = req.body;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !jobType ||
      !location ||
      !experience ||
      !position ||
      !joiningDate
    ) {
      return res.status(404).json({
        message: "Please fill in all the fields",
        success: false,
      });
    }
    job = await Job.findByIdAndUpdate(
      { _id: jobId },
      {
        title,
        description,
        requirements: requirements,
        salary,
        location,
        jobType,
        experience,
        joiningDate,
        position,
      }
    );
    await job.save();

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job,
    });
  } catch (err) {
    console.log("Error in updating job by id controller. Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const deleteJobById = async (req, res) => {
  try {
    const adminId = req.id;
    const jobId = req.params.id;
    const user = await User.findById({ _id: adminId });
    if (user.role !== "recruiter") {
      return res.status(404).json({
        message: "Jobs can be deleted by recruitors only.",
        success: false,
      });
    }
    const job = await Job.findOne({
      created_by: adminId,
      _id: jobId,
    });

    if (!job) {
      return res.json({
        message: "Job does not exist",
        success: false,
      });
    }
    await Job.findByIdAndDelete({ _id: jobId });

    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
      job,
    });
  } catch (err) {
    console.log("Error in deleting job by id controller. Error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const deleteAllJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const { companyId } = req.params;
    const user = await User.findById({ _id: adminId });
    if (user.role !== "recruiter") {
      return res.status(404).json({
        message: "Jobs can be deleted by recruitors only.",
        success: false,
      });
    }
    const result = await Job.deleteMany({
      created_by: adminId,
      company: companyId,
    });

    return res.status(200).json({
      message: "All Jobs for this company deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log(
      "Error in deleting all jobs by company id controller. Error:",
      err
    );
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
