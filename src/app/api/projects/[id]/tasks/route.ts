import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const priority = searchParams.get("priority");
        const assignee = searchParams.get("assignee");
        const resolvedParams = await params;

        let query: any = { projectId: resolvedParams.id };

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        if (priority) {
            query.priority = priority;
        }
        if (assignee) {
            query.assignedTo = assignee;
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks for project:", error);
        return NextResponse.json(
            { message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}
