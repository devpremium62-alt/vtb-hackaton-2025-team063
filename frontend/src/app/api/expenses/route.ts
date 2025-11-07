import {NextResponse} from "next/server";
import fetchWrap from "@/shared/lib/fetchWrap";

export async function GET() {
    const mockData = [
        {
            id: "1",
            category: 6,
            date: new Date(2025, 8, 29),
            name: "Золотое яблоко",
            outcome: true,
            value: 20000,
            bank: "Альфабанк"
        },
        {
            id: "2",
            category: 5,
            date: new Date(2025, 8, 28),
            name: "ИП МАРИЯ МОРОЗОВА",
            outcome: false,
            value: 20000,
            bank: "Сбербанк"
        },
        {
            id: "3",
            category: 4,
            date: new Date(2025, 8, 22),
            name: "Стрелка",
            outcome: true,
            value: 1000,
            bank: "Альфабанк"
        },
        {
            id: "4",
            category: 6,
            date: new Date(2024, 8, 29),
            name: "Золотое яблоко",
            outcome: true,
            value: 20000,
            bank: "Альфабанк"
        },
        {
            id: "5",
            category: 5,
            date: new Date(2024, 8, 28),
            name: "ИП МАРИЯ МОРОЗОВА",
            outcome: false,
            value: 20000,
            bank: "Сбербанк"
        },
        {
            id: "6",
            category: 4,
            date: new Date(2024, 8, 22),
            name: "Стрелка",
            outcome: true,
            value: 1000,
            bank: "Альфабанк"
        }
    ];

    const categories = await fetchWrap("/api/expenses/categories");
    return NextResponse.json(mockData.map(item => ({
        ...item,
        category: categories.find((c: any) => c.id === item.category)
    })));
}