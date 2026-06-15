import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const projects = await Project.find().sort({ createdAt: -1 });
        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { message: "Failed to fetch projects" },
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
