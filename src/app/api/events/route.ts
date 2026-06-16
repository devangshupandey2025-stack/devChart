import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import Activity from "@/models/Activity";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ startDate: 1 });
        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { message: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.title || !body.startDate) {
            return NextResponse.json(
                { message: "Title and Start Date are required" },
                { status: 400 }
            );
        }

        const event = await Event.create(body);

        await Activity.create({
            projectId: event.projectId,
            type: event.type === "MILESTONE" ? "MILESTONE_CREATED" : "EVENT_CREATED",
            eventTitle: event.title,
            action: `created ${event.type === "MILESTONE" ? "milestone" : "event"} "${event.title}"`
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { message: "Failed to create event" },
            { status: 500 }
        );
    }
}
