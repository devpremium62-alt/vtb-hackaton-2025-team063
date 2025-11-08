import {NextResponse} from "next/server";
import {getFamilyAccounts} from "@/app/api/users/family/data";

export async function GET() {
    return NextResponse.json(getFamilyAccounts());
}