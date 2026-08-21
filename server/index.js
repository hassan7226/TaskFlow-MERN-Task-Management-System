import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import taskRoute from "./routes/taskRoute.js";
import reportRoute from "./routes/reportRouter.js";
import invitationRoute from "./routes/invitationRoute.js";
import cookieParser from "cookie-parser";
import upload from "./middlewares/uploadMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();


//database connection
connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//uploads folder static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/reports", reportRoute);
app.use("/api/invitations", invitationRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app; 