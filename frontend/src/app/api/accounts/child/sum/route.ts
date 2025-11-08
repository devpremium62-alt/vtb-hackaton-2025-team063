import {depositMoney} from "@/app/api/accounts/child/data";
import {NextResponse} from "next/server";

export async function PATCH(req: Request) {
    const data = await req.json();
    const newAccount = depositMoney(data);
    return NextResponse.json(newAccount);
}