import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { uploadPdfBuffer } from "../utils/cloudinaryUpload.js";

export const updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "headline", "location", "skills"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    if (typeof updates.skills === "string") updates.skills = updates.skills.split(",").map((s) => s.trim()).filter(Boolean);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please choose a PDF resume" });
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: "Cloudinary is not configured. Add credentials to backend/.env" });
    }

    const existing = await User.findById(req.user._id);
    if (existing.resumePublicId) {
      await cloudinary.uploader.destroy(existing.resumePublicId, { resource_type: "raw" }).catch(() => {});
    }

    const result = await uploadPdfBuffer(req.file.buffer);
    existing.resumeUrl = result.secure_url;
    existing.resumePublicId = result.public_id;
    await existing.save();

    res.json({ message: "Resume uploaded successfully", resumeUrl: existing.resumeUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
