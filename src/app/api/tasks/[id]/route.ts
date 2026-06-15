import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Activity from "@/models/Activity";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const resolvedParams = await params;

        const task = await Task.findById(resolvedParams.id);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        const oldStatus = task.status;
        const oldAssignee = task.assignedTo;

        if (body.status === "DONE" && oldStatus !== "DONE") {
            body.completedAt = new Date();
        } else if (body.status && body.status !== "DONE" && oldStatus === "DONE") {
            body.completedAt = null;
        }

        const updatedTask = await Task.findByIdAndUpdate(resolvedParams.id, body, {
            new: true,
            runValidators: true,
        });

        // Generate activity logs based on what changed
        if (body.status && body.status !== oldStatus) {
            await Activity.create({
                taskId: updatedTask._id,
                action: `changed status from ${oldStatus} to ${body.status}`,
            });
        }

        if (body.assignedTo && body.assignedTo !== oldAssignee) {
            await Activity.create({
                taskId: updatedTask._id,
                action: `assigned task to ${body.assignedTo}`,
            });
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { message: "Failed to update task" },
            { status: 500 }
        );
    }
}
