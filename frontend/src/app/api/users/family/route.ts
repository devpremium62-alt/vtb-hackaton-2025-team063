import {NextResponse} from "next/server";

export async function GET() {
    const mockData = [
        {avatar: "/images/man.png", name: "Пётр", balance: 120000, expenses:10000, accountDigits: "0934"},
        {avatar: "/images/woman.png", name: "Мария", balance: 120000, expenses:19000, accountDigits: "1289"},
    ];

    return NextResponse.json(mockData);
}