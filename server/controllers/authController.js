import userModel from "../models/User.js";
import Invitation from "../models/Invitation.js";
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
        console.log('Signup request body:', req.body);
        const { name, email, password, profileImageUrl, role, invitationToken } = req.body;

        if(!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if(!role || !['admin', 'member'].includes(role)) {
            console.log('Invalid role:', role);
            return res.status(400).json({ message: "Please select a valid role (admin or member)" });
        }

        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: "User already exists" });
        }

        let adminId = null;
        
        if(role === "admin") {
            console.log('Creating admin account');
            // Admins are their own tenant (adminId remains null)
            // No invitation needed for admins
        } else {
            console.log('Creating member account');
            // Members require an invitation token
            if (!invitationToken) {
                return res.status(400).json({ message: "Invitation token is required for team members" });
            }

            const invitation = await Invitation.findOne({ token: invitationToken, status: 'pending' });

            if (!invitation) {
                return res.status(400).json({ message: "Invalid or expired invitation" });
            }

            if (invitation.email !== email.toLowerCase()) {
                return res.status(400).json({ message: "Invitation email does not match" });
            }

            if (invitation.isExpired()) {
                await Invitation.findByIdAndUpdate(invitation._id, { status: 'expired' });
                return res.status(400).json({ message: "Invitation has expired" });
            }

            // Members are linked to the admin who invited them
            adminId = invitation.invitedBy;
            
            // Mark invitation as accepted immediately after validation
            await Invitation.findByIdAndUpdate(invitation._id, {
                status: 'accepted',
                acceptedAt: new Date()
            });
        }

        //hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('Creating user with role:', role, 'adminId:', adminId);

        //create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
            adminId
        });

        console.log('User created successfully:', user._id);

     /*    res.cookie("token", generateToken(user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }); */

        //send email (optional - if email fails, still complete signup)
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Welcome to Task Manager App",
                text: `Hello ${user.name},\n\nWelcome to Task Manager App! Your account has been successfully created.\n\nBest regards,\nTask Manager App Team`
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.warn('Email sending failed during signup:', emailError.message);
            // Continue without failing - the user account is still created
        }

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token : generateToken(user),
            message: "User created successfully"});

    } catch (error) {
        console.error('=== SIGNUP ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Request body:', req.body);
        console.error('===================');
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
            secure: true,
            sameSite: "none",
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

        // Convert localhost URLs to production URLs for profile images
        const baseUrl = process.env.BACKEND_URL;
        if (user.profileImageUrl && baseUrl) {
            user.profileImageUrl = user.profileImageUrl.replace(
                /http:\/\/localhost:\d+/,
                baseUrl
            );
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
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({ message: "User logged out successfully" });
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
        if(String(user.resetOtp) !== String(otp)) {
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
  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(200).json({ message: "Profile picture uploaded successfully", imageUrl });
}
catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};