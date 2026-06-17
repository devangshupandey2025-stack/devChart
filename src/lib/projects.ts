import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
import Event from "@/models/Event";

export async function fetchProjectsData() {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    const projectsWithStats = [];
    
    for (const project of projects) {
        const tasks = await Task.find({ projectId: project._id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "DONE").length;
        
        const completedTasksPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        
        let totalProgress = 0;
        tasks.forEach(t => {
            if (t.status === "DONE") totalProgress += 100;
            else totalProgress += (t.currentProgress || 0);
        });
        const completionPercentage = totalTasks === 0 ? 0 : Math.round(totalProgress / totalTasks);
        
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
        const healthScore = totalTasks === 0 ? 100 : Math.round((completedTasksPercentage * 0.5) + (completionPercentage * 0.2) + (onTimeRate * 0.3));
        
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
            ...upcomingTasks.map(t => ({ title: t.title, date: new Date(t.dueDate!) })),
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

    return JSON.parse(JSON.stringify(projectsWithStats));
}
