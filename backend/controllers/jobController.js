import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getJobs = async (req, res) => {
  try {
    const {
      search = "",
      location = "",
      type = "",
      workplace = "",
      page = 1,
      limit = 10,
    } = req.query;
    const query = { isActive: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;
    if (workplace) query.workplace = workplace;

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "name email",
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: "Job not found" });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      workplace,
      salary,
      description,
      requirements = [],
      skills = [],
    } = req.body;
    if (!title || !company || !location || !description)
      return res
        .status(400)
        .json({
          message: "Title, company, location and description are required",
        });
    const normalize = (value) =>
      Array.isArray(value)
        ? value
        : String(value || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
    const job = await Job.create({
      title,
      company,
      location,
      type,
      workplace,
      salary,
      description,
      requirements: normalize(requirements),
      skills: normalize(skills),
      recruiter: req.user._id,
    });
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const myJobs = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({
    createdAt: -1,
  });
  const withCounts = await Promise.all(
    jobs.map(async (job) => ({
      ...job.toObject(),
      applicants: await Application.countDocuments({ job: job._id }),
    })),
  );
  res.json({ jobs: withCounts });
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      recruiter: req.user._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    Object.assign(job, req.body);
    if (typeof req.body.skills === "string")
      job.skills = req.body.skills
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    if (typeof req.body.requirements === "string")
      job.requirements = req.body.requirements
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    await job.save();
    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      recruiter: req.user._id,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
