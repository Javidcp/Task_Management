import express from "express";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/error.middleware.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express()
connectDB()

app.use(express.json())
app.use(cookieParser())


app.use(cors({
    origin: [process.env.FRONT_URL, "http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTION'],
    credentials: true
}))

app.use('/api/auth', userRoutes)
app.use('/api/task', taskRoutes)

app.use(errorHandler)

export default app
