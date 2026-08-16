import express from "express";
const router = express.Router();
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile
    , logoutUser, sendVerifyOtp, verifyOtp,
    isUserVerified, resetPasswordOtp, resetPassword, uploadProfilePicture
  } from "../controllers/authController.js";
  import {auth} from "../middlewares/userAuth.js";
  import upload from "../middlewares/uploadMiddleware.js";


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUserProfile);
router.put("/update-profile", auth, updateUserProfile);
router.delete("/delete-profile", auth, deleteUserProfile);
router.post("/logout", logoutUser);
router.post("/send-verify-otp",auth, sendVerifyOtp);
router.post("/verify-account", auth, verifyOtp);
router.post("/is-user-verified", auth, isUserVerified);
router.post("/reset-password-otp", resetPasswordOtp);
router.post("/reset-password", resetPassword);
router.post("/upload-image", upload.single("image"), uploadProfilePicture);


export default router;