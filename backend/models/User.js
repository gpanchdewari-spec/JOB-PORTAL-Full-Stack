import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    headline: { type: String, default: "" },
    location: { type: String, default: "" },
    skills: [{ type: String }],
    resumeUrl: { type: String, default: "" },
    resumePublicId: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
