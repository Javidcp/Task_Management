import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    cardColor: { type: String, default: "#FFFFFF", enum: ['#A7F3D0', '#C084FC', '#FEB6A0', '#7DD3FC', '#FEF08A', '#4ADE80', '#2DD4BF', '#60A5FA', '#818CF8', '#A78BFA', '#F472B6', '#F87171', '#9CA3AF'] },
    repeat: { type:{ type: String, enum: ['Daily', 'Weekly', 'Monthly']}, days: [{ type: String }], dayOfMonth: { type: Number, min: 1, max: 31 } },
    repeatInterval: { type: Boolean, default: false },
    tags: { type: String },
    date: { type: Date, default: Date.now },
    isRead: [{ type: String }]
})


const Task = mongoose.model('Task', taskSchema)
export default Task