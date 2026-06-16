import mongoose from "mongoose";

const TaskUpdateSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    author: {
        type: String,
        required: true
    },
    updateText: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TaskUpdate = mongoose.models.TaskUpdate || mongoose.model("TaskUpdate", TaskUpdateSchema);

export default TaskUpdate;
