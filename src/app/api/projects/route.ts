import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const projects = await Project.find().sort({ createdAt: -1 });
        const projectsWithStats = [];
        
        for (const project of projects) {
            const tasks = await Task.find({ projectId: project._id });
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.status === "DONE").length;
            
            const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
            
            let onTimeTasks = 0;
            tasks.forEach(t => {
                if (!t.dueDate) {
                    onTimeTasks++;
                } else if (t.status === "DONE") {
                    if (t.completedAt && new Date(t.completedAt) <= new Date(t.dueDate)) {
                        onTimeTasks++;
                    } else if (!t.completedAt) {
                        onTimeTasks++; // fallback if completedAt is missing for old tasks
                    }
                } else {
                    if (new Date() <= new Date(t.dueDate)) {
                        onTimeTasks++;
                    }
                }
            });

            const onTimeRate = totalTasks === 0 ? 100 : Math.round((onTimeTasks / totalTasks) * 100);
            const healthScore = totalTasks === 0 ? 100 : Math.round((completionPercentage * 0.7) + (onTimeRate * 0.3));
            
            let healthStatus = "🟢 Healthy";
            if (healthScore < 50) healthStatus = "🔴 Delayed";
            else if (healthScore < 80) healthStatus = "🟡 At Risk";

            // Find next event or deadline
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            const upcomingTasks = tasks.filter(t => t.status !== "DONE" && t.dueDate && new Date(t.dueDate) >= now);
            
            let upcomingEvents: any[] = [];
            try {
                upcomingEvents = await Event.find({ projectId: project._id, startDate: { $gte: now } });
            } catch {
                // Events collection may not exist yet
            }

            const upcomingTimeline = [
                ...upcomingTasks.map(t => ({ title: t.title, date: new Date(t.dueDate) })),
                ...upcomingEvents.map(e => ({ title: e.title, date: new Date(e.startDate) }))
            ].sort((a, b) => a.date.getTime() - b.date.getTime());

            const nextEvent = upcomingTimeline.length > 0 ? {
                title: upcomingTimeline[0].title,
                date: upcomingTimeline[0].date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            } : null;

            projectsWithStats.push({
                ...project.toObject(),
                stats: {
                    totalTasks,
                    completedTasks,
                    completionPercentage,
                    healthScore,
                    healthStatus,
                    nextEvent
                }
            });
        }

        return NextResponse.json(projectsWithStats);
    } catch (error: any) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { message: "Failed to fetch projects", error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json(
                { message: "Project name is required" },
                { status: 400 }
            );
        }

        const project = await Project.create(body);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { message: "Failed to create project" },
            { status: 500 }
        );
    }
}
