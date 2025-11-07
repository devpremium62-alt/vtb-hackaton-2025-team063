import { NextResponse } from "next/server";

export async function GET() {
    const mockData = {balance: 12345000, monthlyIncome: 120000};

    return NextResponse.json(mockData);
}