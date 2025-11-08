import {NextResponse} from "next/server";
import {expenseUpdateCategory, getExpenses} from "@/app/api/expenses/data";

export async function GET() {
    return NextResponse.json(getExpenses());
}

export async function PATCH(req: Request) {
    const {expenseId, categoryId} = await req.json();
    const changedExpense = expenseUpdateCategory(expenseId, categoryId);
    return NextResponse.json(changedExpense);
}