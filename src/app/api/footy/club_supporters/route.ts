import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        id,
        player,
        club,
    } = await req.json();

    const club_supporter = await prisma.club_supporter.create({
        data: {
            id,
            player,
            club,
        },
    });

    return NextResponse.json(club_supporter);
};

export const GET = async () => {
    const club_supporters = await prisma.club_supporter.findMany({});

    return NextResponse.json(club_supporters);
};

export const PUT = async (req: NextRequest) => {
    const {
        id,
        player,
        club,
    } = await req.json();

    const club_supporter = await prisma.club_supporter.update({
        where: {
            id: Number(id),
        },

        data: {
            id,
            player,
            club,
        },
    });

    return NextResponse.json(club_supporter);
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const id = Number(url.get("id")) || 0;

    const club_supporter = await prisma.club_supporter.delete({
        where: {
            id: id,
        },
    });

    if (!club_supporter) {
        return NextResponse.json({
            message: "Error",
            status: 500,
        });
    }

    return NextResponse.json({});
};
