import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Activity from "@/models/Activity";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // 1. Stats Aggregation
        const tasks = await Task.find();
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "DONE").length;
        const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS").length;
        const pendingTasks = tasks.filter(t => t.status === "TODO").length;
        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        const stats = {
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            completionPercentage,
        };

        // 2. Chart Data (Task Distribution by Status)
        const chartData = [
            { name: "To Do", value: pendingTasks, fill: "#f3f4f6" }, // gray-100
            { name: "In Progress", value: inProgressTasks, fill: "#93c5fd" }, // blue-300
            { name: "Done", value: completedTasks, fill: "#86efac" }, // green-300
        ].filter(d => d.value > 0);

        // 3. Recent Deadlines
        const upcomingTasks = await Task.find({
            status: { $ne: "DONE" },
            dueDate: { $exists: true, $ne: null }
        }).sort({ dueDate: 1 }).limit(5);

        // 4. Activity Feed
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('taskId', 'title'); // if we want to show task title, but we stored string in action anyway

        return NextResponse.json({
            stats,
            chartData,
            upcomingTasks,
            activities
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
