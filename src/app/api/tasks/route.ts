import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Activity from "@/models/Activity";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.projectId || !body.title) {
            return NextResponse.json(
                { message: "projectId and title are required" },
                { status: 400 }
            );
        }

        const task = await Task.create(body);

        // Generate automatic activity log
        await Activity.create({
            taskId: task._id,
            action: `created task "${task.title}"`,
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json(
            { message: "Failed to create task" },
            { status: 500 }
        );
    }
}