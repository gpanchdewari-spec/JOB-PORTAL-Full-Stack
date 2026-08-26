import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: "Full-time" },
    workplace: { type: String, enum: ["On-site", "Hybrid", "Remote"], default: "On-site" },
    salary: { type: String, default: "Not disclosed" },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
