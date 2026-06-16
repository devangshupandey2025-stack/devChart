import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Activity from "@/models/Activity";
import Event from "@/models/Event";
import TaskUpdate from "@/models/TaskUpdate";
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
            .limit(5);
            
        // Today's Activity Stats
        const startOfToday = new Date();
        startOfToday.setHours(0,0,0,0);
        const todaysActivities = await Activity.find({ createdAt: { $gte: startOfToday } });
        
        const todayStats = {
            total: todaysActivities.length,
            tasksCompleted: todaysActivities.filter(a => a.type === "TASK_COMPLETED").length,
            milestonesCreated: todaysActivities.filter(a => a.type === "MILESTONE_CREATED").length,
            projectsCreated: todaysActivities.filter(a => a.type === "PROJECT_CREATED").length
        };

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

        // Dashboard enhancements: Most Active Tasks, Tasks Needing Attention, Execution Velocity
        const mostActiveTasks = await Task.find({ updateCount: { $gt: 0 } })
            .sort({ updateCount: -1 })
            .limit(5)
            .lean();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const tasksNeedingAttention = await Task.find({
            status: { $ne: "DONE" },
            $or: [
                { updatedAt: { $lt: sevenDaysAgo } },
                { updatedAt: { $exists: false }, createdAt: { $lt: sevenDaysAgo } }
            ]
        }).sort({ updatedAt: 1 }).limit(5).lean();

        // Execution velocity (TaskUpdates today vs yesterday)
        let executionVelocity = { updatesToday: 0, percentChange: 0 };
        
        if (TaskUpdate) {
            const startOfYesterdayLocal = new Date();
            startOfYesterdayLocal.setDate(startOfYesterdayLocal.getDate() - 1);
            startOfYesterdayLocal.setHours(0, 0, 0, 0);

            const startOfTodayLocal = new Date();
            startOfTodayLocal.setHours(0, 0, 0, 0);

            const updatesTodayCount = await TaskUpdate.countDocuments({ createdAt: { $gte: startOfTodayLocal } });
            const updatesYesterdayCount = await TaskUpdate.countDocuments({ createdAt: { $gte: startOfYesterdayLocal, $lt: startOfTodayLocal } });

            let executionVelocityPercent = 0;
            if (updatesYesterdayCount > 0) {
                executionVelocityPercent = Math.round(((updatesTodayCount - updatesYesterdayCount) / updatesYesterdayCount) * 100);
            } else if (updatesTodayCount > 0) {
                executionVelocityPercent = 100;
            }

            executionVelocity = {
                updatesToday: updatesTodayCount,
                percentChange: executionVelocityPercent
            };
        }

        // --- Automation Engine Data ---
        const fortyEightHoursFromNow = new Date();
        fortyEightHoursFromNow.setHours(fortyEightHoursFromNow.getHours() + 48);
        const twentyFourHoursFromNow = new Date();
        twentyFourHoursFromNow.setHours(twentyFourHoursFromNow.getHours() + 24);

        // 1. Risk Tasks
        const rawRiskTasks = await Task.find({
            status: { $ne: "DONE" },
            currentProgress: { $ne: 100 },
            dueDate: { $lte: fortyEightHoursFromNow },
        }).lean();

        const riskTasks = rawRiskTasks.filter(t => (t.currentProgress || 0) < 70).map(t => {
            let severity = "medium";
            if (t.dueDate <= twentyFourHoursFromNow && (t.currentProgress || 0) < 30) {
                severity = "high";
            }
            return {
                id: t._id.toString(),
                title: t.title,
                dueDate: t.dueDate,
                progress: t.currentProgress || 0,
                severity
            };
        });

        // 2. Stale Tasks
        const inProgressTasksRaw = await Task.find({ status: "IN_PROGRESS" }).lean();
        const staleTasks = [];
        for (const t of inProgressTasksRaw) {
            const lastUpdate = await TaskUpdate.findOne({ taskId: t._id }).sort({ createdAt: -1 }).lean();
            const lastDate = lastUpdate ? new Date(lastUpdate.createdAt) : new Date(t.createdAt);
            
            if (lastDate < sevenDaysAgo) {
                const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                staleTasks.push({
                    id: t._id.toString(),
                    title: t.title,
                    lastUpdateDate: lastDate,
                    daysStale: diffDays,
                    severity: "low"
                });
            }
        }
        
        // Sort stale tasks by daysStale descending
        staleTasks.sort((a, b) => b.daysStale - a.daysStale);

        // 3. Achieved Milestones (Last 7 Days)
        const achievedMilestonesLast7Days = await Activity.find({
            type: "MILESTONE_REACHED",
            action: "reached 100% progress",
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            stats,
            todayStats,
            chartData,
            upcomingTimeline,
            activities,
            leaderboard,
            hallOfFame,
            mostActiveTasks,
            tasksNeedingAttention,
            executionVelocity,
            automation: {
                staleTasks,
                riskTasks,
                achievedMilestones: achievedMilestonesLast7Days
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
