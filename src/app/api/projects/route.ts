import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
import Event from "@/models/Event";
import Activity from "@/models/Activity";
import { NextResponse } from "next/server";
import { PROJECT_TEMPLATES } from "@/lib/templates";
import { fetchProjectsData } from "@/lib/projects";

export async function GET() {
    try {
        const projectsWithStats = await fetchProjectsData();
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

        const { templateId, ...projectData } = body;
        const project = await Project.create({
            ...projectData,
            templateId: templateId === "custom" ? undefined : templateId
        });

        await Activity.create({
            projectId: project._id,
            type: "PROJECT_CREATED",
            projectName: project.name,
            action: `created project "${project.name}"`
        });

        if (templateId && templateId !== "custom") {
            const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
            if (template) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Generate Tasks
                const taskPromises = template.tasks.map(taskTemplate => {
                    const dueDate = new Date(today);
                    dueDate.setDate(today.getDate() + taskTemplate.dayOffset);

                    return Task.create({
                        projectId: project._id,
                        title: taskTemplate.title,
                        status: "TODO",
                        priority: taskTemplate.priority || "Medium",
                        dueDate: dueDate
                    });
                });
                await Promise.all(taskPromises);

                // Generate Milestones

                
                const milestonePromises = template.milestones.map(milestone => {
                    const milestoneDate = new Date(today);
                    milestoneDate.setDate(today.getDate() + milestone.dayOffset);
                    
                    return Event.create({
                        projectId: project._id,
                        title: milestone.title,
                        type: "MILESTONE",
                        startDate: milestoneDate
                    });
                });
                await Promise.all(milestonePromises);
            }
        }

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { message: "Failed to create project" },
            { status: 500 }
        );
    }
}
