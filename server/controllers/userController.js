import userModel from "../models/User.js";
import taskModel from "../models/Task.js";
import bycrypt from "bcryptjs";
import { auth, adminOnly } from "../middlewares/userAuth.js";

export const getUsers = async (req, res) => {
    try{
        // Filter users by admin's tenant
       const adminFilter = req.user.role === "admin" ? { adminId: req.user._id } : { adminId: req.user.adminId };
        const users = await userModel.find({ ...adminFilter, role: "member" }).select("-password");

        //add task count to each user
        const usersWithTaskCount = await Promise.all(
            users.map(async (user) => {

            const pendingTasks = await taskModel.countDocuments({ assignedTo: user._id, status: "pending", adminId: req.user.role === "admin" ? req.user._id : req.user.adminId });
            const inProgressTasks = await taskModel.countDocuments({ assignedTo: user._id, status: "in-progress", adminId: req.user.role === "admin" ? req.user._id : req.user.adminId });
            const completedTasks = await taskModel.countDocuments({ assignedTo: user._id, status: "completed", adminId: req.user.role === "admin" ? req.user._id : req.user.adminId });
            return { ...user._doc, pendingTasks, inProgressTasks, completedTasks };
        }));

        res.status(200).json(usersWithTaskCount);

    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try{
       const user = await userModel.findById(req.params.id).select("-password");
       if(!user){
        return res.status(404).json({ message: "User not found" });
       }
       res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try{
        const user = await userModel.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });

    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};