import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Activity from "@/models/Activity";
import Event from "@/models/Event";
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

        // 3. Upcoming Timeline (Combined Events & Tasks)
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const tasksWithDeadlines = await Task.find({
            status: { $ne: "DONE" },
            dueDate: { $gte: now }
        }).lean();

        const upcomingEvents = await Event.find({
            startDate: { $gte: now }
        }).lean();

        const timelineItems = [
            ...tasksWithDeadlines.map(t => ({
                id: t._id.toString(),
                title: t.title,
                date: t.dueDate,
                type: "DEADLINE",
                isTask: true
            })),
            ...upcomingEvents.map(e => ({
                id: e._id.toString(),
                title: e.title,
                date: e.startDate,
                type: e.type,
                isTask: false
            }))
        ];

        // Sort by date ascending
        timelineItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const upcomingTimeline = timelineItems.slice(0, 5);

        // 4. Activity Feed
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('taskId', 'title'); // if we want to show task title, but we stored string in action anyway

        // 5. XP & Leaderboard calculation
        const memberStats: Record<string, { memberName: string, totalXP: number, completedTasks: number, highPriorityCompleted: number }> = {};
        
        tasks.forEach(t => {
            if (t.status === "DONE" && t.assignedTo) {
                if (!memberStats[t.assignedTo]) {
                    memberStats[t.assignedTo] = { memberName: t.assignedTo, totalXP: 0, completedTasks: 0, highPriorityCompleted: 0 };
                }
                const stats = memberStats[t.assignedTo];
                stats.completedTasks += 1;
                
                let xp = 0;
                if (t.priority === "Low") xp = 5;
                else if (t.priority === "Medium") xp = 10;
                else if (t.priority === "High") {
                    xp = 20;
                    stats.highPriorityCompleted += 1;
                }

                if (t.dueDate && t.completedAt && new Date(t.completedAt) > new Date(t.dueDate)) {
                    xp -= 5;
                }

                stats.totalXP += xp;
            }
        });

        const leaderboard = Object.values(memberStats).sort((a, b) => b.totalXP - a.totalXP);
        const hallOfFame = leaderboard.length > 0 ? leaderboard[0] : null;

        return NextResponse.json({
            stats,
            chartData,
            upcomingTimeline,
            activities,
            leaderboard,
            hallOfFame
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
