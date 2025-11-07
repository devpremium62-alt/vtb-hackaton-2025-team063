import { NextResponse } from "next/server";

export async function GET() {
    const mockData = [
        {
            id: 1,
            date: new Date(2025, 10, 3),
            money: 5000,
            name: "На квартиру",
            payed: true
        },
        {
            id: 2,
            date: new Date(2025, 10, 2),
            money: 4500,
            name: "Детский счет",
            payed: false
        },
        {
            id: 3,
            date: new Date(2025, 10, 10),
            name: "Подписка",
            money: 500,
            payed: false
        },
        {
            id: 4,
            date: new Date(2025, 10, 20),
            name: "Кредит",
            money: 10000,
            payed: false
        },
        {
            id: 5,
            date: new Date(2025, 11, 3),
            money: 5000,
            name: "На квартиру",
            payed: false
        }
    ];

    return NextResponse.json(mockData);
}