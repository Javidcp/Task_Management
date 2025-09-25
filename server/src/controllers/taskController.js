import Task from "../models/Task.js";
import asyncHandler from "../middleware/asyncHandler.js";
import createError from "../utils/createError.js";
import shouldShowTask from "../utils/taskUtils.js";
import mongoose from "mongoose";


const getUserIdFromCookie = (cookie) => {
    try {
        const user = JSON.parse(cookie)
        return  user?.id || null
    } catch (err) {
        return null
    }
}

export const createTask = asyncHandler( async(req, res, next) => {
    const userId = getUserIdFromCookie(req.cookies?.user)
    if (!userId) throw createError("Unauthorized", 401)
    
    const task = new Task({ ...req.body, userId: userId })
    await task.save()

    res.status(201).json(task)
})


export const getTasks = asyncHandler(async (req, res) => {
    const userId = getUserIdFromCookie(req.cookies?.user);
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();    

    const tasks = await Task.find({ userId, date: { $lte: queryDate } });
    const tasksToShow = tasks.filter(task => shouldShowTask(task, queryDate));

    res.json(tasksToShow);
});


export const getTags = asyncHandler(async (req, res) => {
    const userId = getUserIdFromCookie(req.cookies?.user);

    const tasks = await Task.find({ userId }, "tags");
    const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];

    res.json({ tags: allTags });
});


export const markRead = asyncHandler( async(req, res, next) => {
    const { taskId } = req.params;
    const { date } = req.body;
    if (!date) throw createError("Date is required", 400)

    const selectedDateStr = new Date(date).toISOString().slice(0, 10);

    const task = await Task.findById(taskId);
    if (!task) throw createError("Task not found", 404);

    const index = task.isRead.findIndex(d => d === selectedDateStr);

    if (index === -1) {
        task.isRead.push(selectedDateStr);
    } else {
        task.isRead.splice(index, 1);
    }

    await task.save();
    res.json(task);
})


export const deleteTask = asyncHandler( async(req, res, next) => {
    const { taskId } = req.params

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) throw createError('Task not found', 404);

    res.json({ message: 'Task deleted successfully' })
})


export const taskCount = asyncHandler( async(req, res, next) => {
    const userId = getUserIdFromCookie(req.cookies.user)
    const userObjectId = new mongoose.Types.ObjectId(userId)
    
    const today = new Date();

      const tasks = await Task.find({ userId: userObjectId });
      const tasksForToday = tasks.filter(task => shouldShowTask(task, today));
      const totalToday = tasksForToday.length;

  const tagsCountAgg = await Task.aggregate([
    { $match: { userId: userObjectId } },
    { $group: { _id: '$tags', count: { $sum: 1 } } }
  ]);

    const tagsCount = {};
    tagsCountAgg.forEach(item => {
        if (item._id) tagsCount[item._id] = item.count;
    });

    res.json({ totalToday, tagsCount });
})