import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: ["MEETING", "EVENT", "MILESTONE"],
        default: "EVENT",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
