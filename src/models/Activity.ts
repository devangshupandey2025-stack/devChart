import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    type: {
        type: String,
        enum: ["TASK_CREATED", "TASK_COMPLETED", "TASK_ASSIGNED", "STATUS_CHANGED", "EVENT_CREATED", "MILESTONE_CREATED", "MILESTONE_REACHED", "PROJECT_CREATED", "TASK_PROGRESS_UPDATE", "TASK_PROGRESS_STALE"],
    },
    taskTitle: String,
    updatePreview: String,
    eventTitle: String,
    projectName: String,
    previousStatus: String,
    newStatus: String,
    assignedTo: String,
    xpAwarded: Number,
    action: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
