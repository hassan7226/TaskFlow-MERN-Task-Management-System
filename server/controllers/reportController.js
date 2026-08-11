import taskModel from "../models/Task.js";
import userModel from "../models/User.js";
import excelJS from "exceljs";


export const taskReport = async (req, res) => {
    try{
       const tasks = await taskModel.find().populate("assignedTo", "name email");
       // Further processing for task report
       const workbook = new excelJS.Workbook();
       const worksheet = workbook.addWorksheet("Task Report");
       worksheet.columns = [
           { header: "Task ID", key: "id", width: 25 },
           { header: "Title", key: "title", width: 30 },
           { header: "Description", key: "description", width: 50 },
           { header: "Priority", key: "priority", width: 15 },
           { header: "Status", key: "status", width: 20 },
           { header: "Due Date",key: "dueDate", width: 20 },
           { header: "Assigned To", key: "assignedTo", width: 30 },
       ];

         tasks.forEach((task) => {
            const assignedToNames = task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ");
            worksheet.addRow({
                id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedToNames || "unAssigned",
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=task_report.xlsx");
        
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    }
    catch(error){
        res.status(500).json({ message: "Internal server error" });
    }   
};

export const userReport = async (req, res) => {
    try{
         const users = await userModel.find().select("name email _id").lean();
         const userTasks = await taskModel.find().populate("assignedTo", "name email _id");

         const userTaskMap = {};
         users.forEach((user) => {
            userTaskMap[(user._id)] = {
                name: user.name,
                email: user.email,
                tasksCount: 0,
                pendingCount: 0,
                inProgressCount: 0,
                completedCount: 0,
            };
        });

        userTasks.forEach((task) => {
            task.assignedTo.forEach((user) => {
                if (userTaskMap[user._id]) {
                    userTaskMap[user._id].tasksCount += 1;
                    if (task.status === "pending") userTaskMap[user._id].pendingCount += 1;
                    else if (task.status === "in-progress") userTaskMap[user._id].inProgressCount += 1;
                    else if (task.status === "completed") userTaskMap[user._id].completedCount += 1;
                }
            });
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Report");
        worksheet.columns = [
            { header: "User ID", key: "id", width: 25 },
            { header: "Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Total Tasks", key: "tasksCount", width: 15 },
            { header: "Pending Tasks", key: "pendingCount", width: 15 },
            { header: "In-Progress Tasks", key: "inProgressCount", width: 20 },
            { header: "Completed Tasks", key: "completedCount", width: 20 },
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=user_report.xlsx");

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });

        
    }
    catch(error){
        res.status(500).json({ message: "Internal server error" });
    }   
};