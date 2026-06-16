import connectDB from "@/lib/mongodb";
import TaskUpdate from "@/models/TaskUpdate";
import Task from "@/models/Tasks";
import Activity from "@/models/Activity";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const resolvedParams = await params;
        const updates = await TaskUpdate.find({ taskId: resolvedParams.id }).sort({ createdAt: -1 });
        return NextResponse.json(updates);
    } catch (error) {
        console.error("Error fetching updates:", error);
        return NextResponse.json({ message: "Failed to fetch updates" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const resolvedParams = await params;
        const body = await request.json();
        const { author, updateText, progress } = body;

        const task = await Task.findById(resolvedParams.id);
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        const taskUpdate = await TaskUpdate.create({
            taskId: resolvedParams.id,
            author,
            updateText,
            progress
        });

        // Generate milestones
        const oldProgress = task.currentProgress || 0;
        const newProgress = progress;
        
        const previousStatus = task.status;
        let newStatus = task.status;
        let completedAt = task.completedAt;

        if (newProgress === 100 && previousStatus !== "DONE") {
            newStatus = "DONE";
            completedAt = new Date();
        } else if (newProgress > 0 && newProgress < 100 && previousStatus === "TODO") {
            newStatus = "IN_PROGRESS";
        } else if (newProgress < 100 && previousStatus === "DONE") {
            newStatus = "IN_PROGRESS";
            completedAt = null;
        }

        const updatePreview = updateText.length > 50 ? updateText.substring(0, 50) + "..." : updateText;

        task.currentProgress = newProgress;
        task.updateCount = (task.updateCount || 0) + 1;
        task.latestUpdatePreview = updatePreview;
        task.updatedAt = new Date();
        task.status = newStatus;
        task.completedAt = completedAt;
        await task.save();

        const activitiesToCreate = [];

        activitiesToCreate.push({
            taskId: resolvedParams.id,
            projectId: task.projectId,
            type: "TASK_PROGRESS_UPDATE",
            taskTitle: task.title,
            assignedTo: author,
            updatePreview: updatePreview,
            action: `updated progress to ${newProgress}%`
        });

        if (newProgress === 100 && previousStatus !== "DONE") {
            let xpAwarded = 10;
            if (task.priority === "Low") xpAwarded = 5;
            else if (task.priority === "High") xpAwarded = 20;

            if (task.dueDate && new Date() > new Date(task.dueDate)) {
                xpAwarded -= 5;
            }

            activitiesToCreate.push({
                taskId: resolvedParams.id,
                projectId: task.projectId,
                type: "TASK_COMPLETED",
                taskTitle: task.title,
                assignedTo: author,
                action: `completed task ${task.title}`,
                xpAwarded
            });
        } else {
             // Milestones
             const milestones = [25, 50, 75];
             for (const m of milestones) {
                 if (oldProgress < m && newProgress >= m) {
                     activitiesToCreate.push({
                         taskId: resolvedParams.id,
                         projectId: task.projectId,
                         type: "MILESTONE_REACHED",
                         taskTitle: task.title,
                         assignedTo: author,
                         action: `reached ${m}% progress`
                     });
                 }
             }
             
             if (newStatus !== previousStatus && newProgress !== 100) {
                 activitiesToCreate.push({
                     taskId: resolvedParams.id,
                     projectId: task.projectId,
                     type: "STATUS_CHANGED",
                     taskTitle: task.title,
                     assignedTo: author,
                     previousStatus: previousStatus,
                     newStatus: newStatus,
                     action: `changed status from ${previousStatus} to ${newStatus}`,
                 });
             }
        }

        await Activity.insertMany(activitiesToCreate);

        return NextResponse.json(taskUpdate, { status: 201 });
    } catch (error) {
        console.error("Error creating task update:", error);
        return NextResponse.json({ message: "Failed to create task update" }, { status: 500 });
    }
}
