import { NextResponse } from "next/server";
import { fetchDashboardData } from "@/lib/dashboard";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await fetchDashboardData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
