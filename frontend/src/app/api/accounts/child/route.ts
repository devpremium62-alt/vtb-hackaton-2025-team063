import { NextResponse } from "next/server";
import {changeLimit, getChildAccount} from "@/app/api/accounts/child/data";

export async function GET() {
    return NextResponse.json(getChildAccount());
}

export async function PATCH(req: Request) {
    const data = await req.json();
    const newAccount = changeLimit(data);
    return NextResponse.json(newAccount);
}