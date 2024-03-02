import { NextRequest, NextResponse } from "next/server";
import playerService from "services/Player";

export const POST = async (req: NextRequest) => {
    const data = await req.json();
    const player = await playerService.create(data);

    return NextResponse.json(player);
};

export const GET = async () => {
    const players = await playerService.getAll();

    return NextResponse.json(players);
};

export const PUT = async (req: NextRequest) => {
    const data = await req.json();
    const player = await playerService.create(data);

    return NextResponse.json(player);
};

export const DELETE = async () => {
    await playerService.deleteAll();

    return NextResponse.json({});
};
