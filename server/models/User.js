import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  email: {
    type: String,required: true, unique: true
  },
  password: {
    type: String,  required: true, unique: true
  },
  profileImageUrl: {
    type: String, default: null
  },
  role: {
    type: String, enum: ['admin', 'member'], default: 'member'
  },
  verifyOtp: {
    type: String, default: ''
  },
  verifyOtpExpiry: {
    type: Number, default: 0
  },
  isAccountVerified: {
    type: Boolean, default: false
  },
  resetOtp: {
    type: String, default: ''
  },
  resetOtpExpiry: {
    type: Number, default: 0
  }
}, { timestamps: true });

export default mongoose.model("userModel", userSchema);