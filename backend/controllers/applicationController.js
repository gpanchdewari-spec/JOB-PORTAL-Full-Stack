import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isActive) return res.status(404).json({ message: "Job not available" });
    if (!req.user.resumeUrl) return res.status(400).json({ message: "Upload your resume before applying" });

    const application = await Application.create({ job: job._id, candidate: req.user._id, coverLetter: req.body.coverLetter || "" });
    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You already applied to this job" });
    res.status(500).json({ message: error.message });
  }
};

export const myApplications = async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({ path: "job", populate: { path: "recruiter", select: "name email" } })
    .sort({ createdAt: -1 });
  res.json({ applications });
};

export const jobApplicants = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
  if (!job) return res.status(404).json({ message: "Job not found" });
  const applications = await Application.find({ job: job._id }).populate("candidate", "name email headline location skills resumeUrl").sort({ createdAt: -1 });
  res.json({ job, applications });
};

export const updateApplicationStatus = async (req, res) => {
  const allowed = ["applied", "reviewing", "shortlisted", "rejected", "hired"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });

  const application = await Application.findById(req.params.id).populate("job");
  if (!application) return res.status(404).json({ message: "Application not found" });
  if (String(application.job.recruiter) !== String(req.user._id)) return res.status(403).json({ message: "Not allowed" });

  application.status = req.body.status;
  await application.save();
  res.json({ application });
};
