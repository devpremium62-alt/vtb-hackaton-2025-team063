import {NextResponse} from "next/server";
import fetchWrap from "@/shared/lib/fetchWrap";

export async function GET() {
    const mockData = [
        {id: 1, category: 1, limit: 20000},
        {id: 2, category: 2, limit: 40000},
        {id: 3, category: 3, limit: 5000},
    ];

    const categories = await fetchWrap("/api/expenses/categories");
    return NextResponse.json(mockData.map(item => ({
        ...item,
        category: categories.find((c: any) => c.id === item.category)
    })));
}