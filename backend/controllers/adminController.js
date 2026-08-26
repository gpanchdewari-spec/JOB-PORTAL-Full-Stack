import Job from "../models/Job.js";
import User from "../models/User.js";

// GET ALL JOBS
export const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.json({
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DEACTIVATE / FAKE JOB
export const deactivateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    job.isActive = false;

    await job.save();

    res.json({
      message: "Job deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ACTIVATE JOB AGAIN
export const activateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    job.isActive = true;

    await job.save();

    res.json({
      message: "Job activated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PERMANENT DELETE
export const deleteJobByAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.json({
      message: "Job permanently deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ALL RECRUITERS
export const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
    }).select("-password");

    res.json({
      recruiters,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
