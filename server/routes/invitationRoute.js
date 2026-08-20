import express from "express"
import { auth, adminOnly } from "../middlewares/userAuth.js";
import { sendInvitation, validateInvitation, getInvitations, deleteInvitation } from "../controllers/invitationController.js";

const router = express.Router();

// Send invitation (admin only)
router.post("/send", auth, adminOnly, sendInvitation);

// Validate invitation token (public)
router.get("/validate/:token", validateInvitation);

// Get all invitations (admin only)
router.get("/", auth, adminOnly, getInvitations);

// Delete invitation (admin only)
router.delete("/:id", auth, adminOnly, deleteInvitation);

export default router;
