import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        id,
        soccerway_id,
        club_name,
        uri,
        country,
    } = await req.json();

    const club = await prisma.club.create({
        data: {
            id,
            soccerway_id,
            club_name,
            uri,
            country,
        },
    });

    return NextResponse.json({
        club,
    });
};

export const GET = async () => {
    const clubs = await prisma.club.findMany({});

    return NextResponse.json({
        clubs,
    });
};

export const PUT = async (req: NextRequest) => {
    const {
        id,
        soccerway_id,
        club_name,
        uri,
        country,
    } = await req.json();

    const club = await prisma.club.update({
        where: {
            id: Number(id),
        },

        data: {
            id,
            soccerway_id,
            club_name,
            uri,
            country,
        },
    });

    return NextResponse.json({
        club,
    });
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const id = Number(url.get("id")) || 0;

    const club = await prisma.club.delete({
        where: {
            id: id,
        },
    });

    if (!club) {
        return NextResponse.json(
            {
                message: "Error",
            },
            {
                status: 500,
            }
        );
    }

    return NextResponse.json({});
};
