import express from "express"
import { createTask, deleteTask, getTags, getTasks, markRead, taskCount } from "../controllers/taskController.js"

const router = express()

router.post('/create', createTask)
router.get('/all', getTasks)
router.get("/tags", getTags);
router.put('/:taskId/toggle-read', markRead)
router.delete('/:taskId/delete', deleteTask)
router.get('/count', taskCount)

export default router