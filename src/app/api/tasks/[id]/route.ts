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

        if (body.dueDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const inputDate = new Date(body.dueDate);
            inputDate.setHours(0, 0, 0, 0);
            if (inputDate < today) {
                return NextResponse.json(
                    { message: "Due date cannot be in the past" },
                    { status: 400 }
                );
            }
        }

        const oldStatus = task.status;
        const oldAssignee = task.assignedTo;

        if (body.status === "DONE" && oldStatus !== "DONE") {
            body.completedAt = new Date();
        } else if (body.status && body.status !== "DONE" && oldStatus === "DONE") {
            body.completedAt = null;
        }

        const updatedTask = await Task.findByIdAndUpdate(resolvedParams.id, body, {
            returnDocument: 'after',
            runValidators: true,
        });

        // Generate activity logs based on what changed
        if (body.status && body.status !== oldStatus) {
            if (body.status === "DONE") {
                let xpAwarded = 10;
                if (updatedTask.priority === "Low") xpAwarded = 5;
                else if (updatedTask.priority === "High") xpAwarded = 20;

                if (updatedTask.dueDate && new Date() > new Date(updatedTask.dueDate)) {
                    xpAwarded -= 5;
                }

                await Activity.create({
                    taskId: updatedTask._id,
                    projectId: updatedTask.projectId,
                    type: "TASK_COMPLETED",
                    taskTitle: updatedTask.title,
                    assignedTo: updatedTask.assignedTo,
                    xpAwarded,
                    action: `completed task ${updatedTask.title}`,
                });
            } else {
                await Activity.create({
                    taskId: updatedTask._id,
                    projectId: updatedTask.projectId,
                    type: "STATUS_CHANGED",
                    taskTitle: updatedTask.title,
                    previousStatus: oldStatus,
                    newStatus: body.status,
                    action: `changed status from ${oldStatus} to ${body.status}`,
                });
            }
        }

        if (body.assignedTo && body.assignedTo !== oldAssignee) {
            await Activity.create({
                taskId: updatedTask._id,
                projectId: updatedTask.projectId,
                type: "TASK_ASSIGNED",
                taskTitle: updatedTask.title,
                assignedTo: body.assignedTo,
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
