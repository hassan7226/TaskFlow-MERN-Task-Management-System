import express from "express";
import { auth, adminOnly } from "../middleware/userAuth.js";
import { taskReport, userReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/task-report", auth, adminOnly, taskReport);
router.get("/user-report", auth, adminOnly, userReport);

export default router;