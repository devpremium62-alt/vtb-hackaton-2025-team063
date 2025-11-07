import {NextResponse} from "next/server";
import {getGoals, addGoal, deleteGoal} from "./data";

export async function GET() {
    return NextResponse.json(getGoals());
}

export async function POST(req: Request) {
    const data = await req.json();
    const newGoal = addGoal(data);
    return NextResponse.json(newGoal);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    deleteGoal(id);

    return new NextResponse(null, { status: 204 });
}