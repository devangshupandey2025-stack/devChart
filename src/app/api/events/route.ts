import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
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
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { message: "Failed to create event" },
            { status: 500 }
        );
    }
}
