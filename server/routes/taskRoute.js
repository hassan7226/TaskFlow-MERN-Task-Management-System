import express from "express"
import {auth, adminOnly} from "../middlewares/userAuth.js";
import {getDashboardData, userDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTodoChecklist, uploadTaskAttachment} from "../controllers/taskController.js"; 
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/dashboard-data", auth, getDashboardData);
router.get("/user-dashboard-data", auth, userDashboardData);
router.get("/", auth, getTasks);
router.get("/:id", auth, getTaskById);
router.post("/", auth, adminOnly, createTask);
router.put("/:id", auth, adminOnly, updateTask);
router.delete("/:id", auth, adminOnly, deleteTask);
router.put("/:id/status", auth, updateTaskStatus);
router.put("/:id/todo", auth, updateTodoChecklist);
router.post("/upload-attachment", auth, upload.single("file"), uploadTaskAttachment);

export default router;