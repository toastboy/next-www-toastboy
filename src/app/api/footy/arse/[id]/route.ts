import { NextRequest, NextResponse } from "next/server";
import { arseService } from "lib/arse";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }) {
    const { id } = params;
    const arse = await arseService.get(Number(id));

    return NextResponse.json({
        arse,
    });
}
