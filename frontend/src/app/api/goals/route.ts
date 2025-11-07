import { NextResponse } from "next/server";

export async function GET() {
    const mockData = [
        {
            id: 1,
            name: "Поездка на море",
            deadline: new Date(2025, 8, 29),
            moneyCollected: 200000,
            moneyNeed: 230000
        },
        {
            id: 2,
            name: "Квартира у моря",
            deadline: new Date(2026, 3, 14),
            moneyCollected: 80000000,
            moneyNeed: 450000000
        },
    ];

    return NextResponse.json(mockData);
}