import {NextResponse} from "next/server";
import {getFamilyAccounts} from "@/app/api/users/family/data";

export async function GET() {
    const data = getFamilyAccounts();
    const mockData = {
        balance: Object.values(data).reduce((acc, member) => acc + member.balance, 0),
        monthlyIncome: 120000
    };

    return NextResponse.json(mockData);
}