import express from "express";

import { protect, allowRoles } from "../middleware/authMiddleware.js";

import {
  getAllJobsForAdmin,
  deactivateJob,
  activateJob,
  deleteJobByAdmin,
  getRecruiters,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/jobs", protect, allowRoles("admin"), getAllJobsForAdmin);

router.patch("/jobs/:id/deactivate", protect, allowRoles("admin"), deactivateJob);

router.patch("/jobs/:id/activate", protect, allowRoles("admin"), activateJob);

router.delete("/jobs/:id", protect, allowRoles("admin"), deleteJobByAdmin);

router.get("/recruiters", protect, allowRoles("admin"), getRecruiters);

export default router;
