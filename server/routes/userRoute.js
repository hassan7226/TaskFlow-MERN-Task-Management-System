import express from "express";
const router = express.Router();
import { getUsers, getUserById, deleteUser } from "../controllers/userController.js";
import { auth,adminOnly } from "../middlewares/userAuth.js";


router.get("/", auth,adminOnly, getUsers);
router.get("/:id", auth, adminOnly, getUserById);
router.delete("/:id", auth, adminOnly, deleteUser);

export default router;