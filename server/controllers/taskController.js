import taskModel from "../models/Task.js";

export const getTasks = async (req, res) => {
    try{
        let status = req.query.status;
        let filter = {};

        if(status){
            filter.status = status;
        }
        let tasks;
        if(req.user.role === "admin"){
            tasks = await taskModel.find(filter).populate(
                "assignedTo",
                 "name email  profileImageUrl").populate("createdBy", "name email profileImageUrl");
        }
        else{
            tasks = await taskModel.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo", "name email profileImageUrl").populate(
                    "createdBy", "name email profileImageUrl");
        }

//add todoChecklist count to each task
   
     const task = await Promise.all(tasks.map(async (task) => {
        const completedTodoCount = task.todoChecklist.filter(
        (item) => item.completed).length;

        return { ...task._doc, completedTodoCount };
    })) 

    //status summary counts
    const allTasks = await taskModel.countDocuments(
        req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );
    
    //pending tasks count
    const pendingTasks = await taskModel.countDocuments(
        { ...filter, status: "pending", ...(req.user.role !== "admin" && { assignedTo: req.user._id }) }
    );

    //in-progress tasks count
    const inProgressTasks = await taskModel.countDocuments(
        { ...filter, status: "in-progress", ...(req.user.role !== "admin" && { assignedTo: req.user._id }) }
    );

    //completed tasks count
    const completedTasks = await taskModel.countDocuments(
        { ...filter, status: "completed", ...(req.user.role !== "admin" && { assignedTo: req.user._id }) }
    );

    res.status(200).json({
        message: "Tasks fetched successfully",
        tasks,
        summary: {
            all: allTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
        },
    });

}
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const getTaskById = async (req, res) => {
    try{
        const task = await taskModel.findById(req.params.id).populate(
            "assignedTo", "name email profileImageUrl").populate(
                "createdBy", "name email profileImageUrl");

                if(!task){
                    return res.status(404).json({ message: "Task not found" });
                }
        res.status(200).json({ message: "Task fetched successfully", task });
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const createTask = async (req, res) => {
    
    try {
        const {
            title,description,priority,status,dueDate,assignedTo,attachments,todoChecklist
        } = req.body;
        if(!Array.isArray(assignedTo)){
            return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
        }

        const task = await taskModel.create({
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
            createdBy: req.user._id
        });

        res.status(201).json({ message: "Task created successfully", task })}
        catch (error){
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    };

export const updateTask = async (req, res) => {
    try {
        // Validate assignedTo before updating
        if (
            req.body.assignedTo !== undefined &&
            !Array.isArray(req.body.assignedTo)
        ) {
            return res.status(400).json({
                message: "assignedTo must be an array of user IDs"
            });
        }

        const task = await taskModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    try{
        const task = await taskModel.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const isAssigned= task.assignedTo.some(userId => userId.toString() === req.user._id.toString());
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to update the status of this task"
            });
        }
        task.status = req.body.status;

        if(task.status === "completed"){
            task.todoChecklist.forEach(item => item.completed = true);
            task.progress = 100;
        }
        await task.save();
        res.status(200).json({
            message: "Task status updated successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateTodoChecklist = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const isAssigned= task.assignedTo.some(userId => userId.toString() === req.user._id.toString());
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to update the todo checklist of this task"
            });
        }

        task.todoChecklist = req.body.todoChecklist;
        
        //auto update progress based on completed items
        const totalItems = task.todoChecklist.length;
        const completedItems = task.todoChecklist.filter(item => item.completed).length;
        task.progress = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;

        //auto mark task as completed if all todo items are completed
        if (task.progress === 100) {
            task.status = "completed";}
            else if (task.progress > 0 && task.progress < 100) {
                task.status = "in-progress";
            }
            else {
                task.status = "pending";
            }
        await task.save();
        const updatedTask = await taskModel.findById(req.params.id).populate(
            "assignedTo", "name email profileImageUrl");

        res.status(200).json({
            message: "Todo checklist updated successfully",
            task: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getDashboardData = async (req, res) => {
    try{
        //fetch statistics for dashboard
        const totalTasks = await taskModel.countDocuments();
        const completedTasks = await taskModel.countDocuments({ status: "completed" });
        const inProgressTasks = await taskModel.countDocuments({ status: "in-progress" });
        const pendingTasks = await taskModel.countDocuments({ status: "pending" });
        const overdueTasks = await taskModel.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: "completed" } });
        

        //ensure all possible statuses are included
        const taskStatuses = ["pending", "in-progress", "completed"];
        const taskDistributionRaw = await taskModel.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formatKey = status.replace(/\s+/g, "");
            acc[formatKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;// Add total tasks count to the distribution

        // ensure all possible priorities are included
        const taskPriorities = ["low", "medium", "high"];
        const priorityDistributionRaw = await taskModel.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = priorityDistributionRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // fetch recent 10 tasks for dashboard
        const recentTasks = await taskModel.find().sort({ createdAt: -1 }).limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            overdueTasks,
        },
            charts: {
            taskDistribution,
            taskPriorityLevels,
        },
            recentTasks
        });
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const userDashboardData = async (req, res) => {
    try{
        const userId = req.user._id;
        const totalTasks = await taskModel.countDocuments({ assignedTo: userId });
        const completedTasks = await taskModel.countDocuments({ assignedTo: userId, status: "completed" });
        const inProgressTasks = await taskModel.countDocuments({ assignedTo: userId, status: "in-progress" });
        const pendingTasks = await taskModel.countDocuments({ assignedTo: userId, status: "pending" });
        const overdueTasks = await taskModel.countDocuments({ assignedTo: userId, dueDate: { $lt: new Date() }, status: { $ne: "completed" } });

        // ensure all possible statuses are included
        const taskStatuses = ["pending", "in-progress", "completed"];
        const taskDistributionRaw = await taskModel.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formatKey = status.replace(/\s+/g, "");
            acc[formatKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;// Add total tasks count to the distribution

        // ensure all possible priorities are included
        const taskPriorities = ["low", "medium", "high"];
        const priorityDistributionRaw = await taskModel.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = priorityDistributionRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // fetch recent 10 tasks for dashboard
        const recentTasks = await taskModel.find({assignedTo: userId}).sort({ createdAt: -1 }).limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                pendingTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks
        });
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
