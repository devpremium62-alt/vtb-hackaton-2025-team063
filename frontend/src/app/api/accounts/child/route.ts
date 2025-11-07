import { NextResponse } from "next/server";

export async function GET() {
    const mockData = {
        moneyCollected: 50000,
        moneyPerDay: 2500,
        avatar: "/images/woman.png",
    };

    return NextResponse.json(mockData);
}