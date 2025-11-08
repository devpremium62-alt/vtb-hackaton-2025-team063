import { NextResponse } from "next/server";
import {getExpenseCategories} from "@/app/api/expenses/categories/data";

export async function GET() {
    return NextResponse.json(getExpenseCategories());
}