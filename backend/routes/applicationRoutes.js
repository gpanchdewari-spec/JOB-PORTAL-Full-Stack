import express from "express";
import { applyToJob, jobApplicants, myApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/apply/:jobId", protect, allowRoles("candidate"), applyToJob);
router.get("/mine", protect, allowRoles("candidate"), myApplications);
router.get("/job/:jobId", protect, allowRoles("recruiter"), jobApplicants);
router.patch("/:id/status", protect, allowRoles("recruiter"), updateApplicationStatus);

export default router;
