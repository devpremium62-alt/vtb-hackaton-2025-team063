import {NextResponse} from "next/server";
import {addWallet, deleteWallet, getWallets} from "@/app/api/accounts/wallets/data";

export async function GET() {
    return NextResponse.json(getWallets());
}

export async function POST(req: Request) {
    const data = await req.json();
    const newWallet = addWallet(data);
    return NextResponse.json(newWallet);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    deleteWallet(id);

    return new NextResponse(null, { status: 204 });
}