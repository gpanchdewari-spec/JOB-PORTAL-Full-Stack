import express from "express";
import { updateProfile, uploadResume } from "../controllers/userController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();
router.put("/profile", protect, updateProfile);
router.post("/resume", protect, allowRoles("candidate"), upload.single("resume"), uploadResume);
export default router;
