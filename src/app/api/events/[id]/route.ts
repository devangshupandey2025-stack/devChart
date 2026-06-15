import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const event = await Event.findByIdAndDelete(id);
        
        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json(
            { message: "Failed to delete event" },
            { status: 500 }
        );
    }
}
