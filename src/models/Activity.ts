import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    action: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
