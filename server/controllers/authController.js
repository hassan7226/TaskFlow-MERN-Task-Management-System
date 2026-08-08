import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import transporter from "../config/nodemailer.js";

dotenv.config();

const generateToken = (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
}

//register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;
        
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //admin invite token check
        let role = "member";
        if(adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        //hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });
        
     /*    res.cookie("token", generateToken(user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }); */

        //send email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome to Task Manager App",
            text: `Hello ${user.name},\n\nWelcome to Task Manager App! Your account has been successfully created.\n\nBest regards,\nTask Manager App Team`
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({ 
            id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token : generateToken(user),
            message: "User created successfully"});

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = async (req,res) => {
    
    try{
      const { email, password } = req.body;
        
      if(!email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }

      const user = await userModel.findOne({ email });
      if(!user) {
        return res.status(400).json({ message: "Email is not correct" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(400).json({ message: "Password is not correct" });
      }

      const token = generateToken(user);

       res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

      res.status(200).json({ 
        id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token : token,
        message: "User logged in successfully"
      });

    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
} 

export const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
} 

export const updateUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { name, email, profileImageUrl, password } = req.body;
        user.name = name;
        user.email = email;
        user.profileImageUrl = profileImageUrl;

        if (req.body.password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(req.body.password, saltRounds);
        }
        await user.save();
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
};

export const deleteUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.remove();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//logout user
export const logoutUser = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//send otp for email verification
export const sendVerifyOtp = async (req,res) => {
    try {
        const user = req.user;
        if (user.isAccountVerified) {
            return res.status(200).json({ message: "User is already verified" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Email Verification",
            text: `Your OTP for email verification is: ${otp}`
        });
        res.status(200).json({ message: `OTP sent successfully to ${user.email}` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//verify otp for email verification
export const verifyOtp = async (req,res) => {
    try {
        const {  otp } = req.body;
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" }); 
        }
        if (user.verifyOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (Date.now() > user.verifyOtpExpiry) {
            return res.status(400).json({ message: "OTP expired" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiry = 0;
        await user.save();
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//check if user is verified
export const isUserVerified = async (req,res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ isVerified: user.isAccountVerified });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//reset password otp

export const resetPasswordOtp = async (req,res) => {
    try{
       const {email} = req.body;
        if(!email) {
            return res.status(400).json({ message: "Please provide email" });
        }
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset Password OTP",
            text: `Your OTP for resetting password is: ${otp}`
        });

        res.status(200).json({ message: `OTP sent successfully to ${user.email}` });
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//reset password

export const resetPassword = async (req,res) => {
    try{
        const {email, otp, newPassword} = req.body;
        if(!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Please provide email, otp and new password" });
        }
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if(Date.now() > user.resetOtpExpiry) {
            return res.status(400).json({ message: "OTP expired" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = '';
        user.resetOtpExpiry = 0;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const uploadProfilePicture = async (req, res) => {

    try {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ message: "Profile picture uploaded successfully", imageUrl });
}
catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}   
};