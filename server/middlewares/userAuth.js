import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/User.js";

dotenv.config();

export const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Please login again.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export const adminOnly = (req, res, next) => {
    
        if(req.user && req.user.role === 'admin'){
            next(); 
        }
        else{
            res.status(403).json({
                message: "Access denied. Admins only.",
            });
        }
    
    }