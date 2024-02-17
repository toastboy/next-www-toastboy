import { NextRequest, NextResponse } from "next/server";
import arseService from "lib/arse";

export const POST = async (req: NextRequest) => {
    const data = await req.json();
    const arse = await arseService.create(data);

    return NextResponse.json(arse);
};

export const GET = async () => {
    const arses = await arseService.getAll();

    return NextResponse.json(arses);
};

export const PUT = async (req: NextRequest) => {
    const data = await req.json();
    const arse = await arseService.create(data);

    return NextResponse.json(arse);
};

export const DELETE = async () => {
    await arseService.deleteAll();

    return NextResponse.json({});
};
