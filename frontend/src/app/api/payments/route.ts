import { NextResponse } from "next/server";
import {addPayment, deletePayment, getPayments} from "@/app/api/payments/data";

export async function GET() {
    return NextResponse.json(getPayments());
}

export async function POST(req: Request) {
    const data = await req.json();
    const newPayment = addPayment(data);
    return NextResponse.json(newPayment);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    deletePayment(id);

    return new NextResponse(null, { status: 204 });
}