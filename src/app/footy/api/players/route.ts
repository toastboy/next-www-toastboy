import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        is_admin,
        login,
        first_name,
        last_name,
        email,
        joined,
        finished,
        born,
        introduced_by,
        comment,
        anonymous,
        goalie,
        mugshot,
    } = await req.json();

    const player = await prisma.player.create({
        data: {
            is_admin,
            login,
            first_name,
            last_name,
            email,
            joined,
            finished,
            born,
            introduced_by,
            comment,
            anonymous,
            goalie,
            mugshot,
        },
    });

    return NextResponse.json({
        player,
    });
};

export const GET = async () => {
    const players = await prisma.player.findMany({});

    return NextResponse.json({
        players,
    });
};

export const PUT = async (req: NextRequest) => {
    const {
        id,
        is_admin,
        login,
        first_name,
        last_name,
        email,
        joined,
        finished,
        born,
        introduced_by,
        comment,
        anonymous,
        goalie,
        mugshot,
    } = await req.json();

    const player = await prisma.player.update({
        where: {
            id: Number(id),
        },

        data: {
            is_admin,
            login,
            first_name,
            last_name,
            email,
            joined,
            finished,
            born,
            introduced_by,
            comment,
            anonymous,
            goalie,
            mugshot,
        },
    });

    return NextResponse.json({
        player,
    });
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const id = Number(url.get("id")) || 0;

    const player = await prisma.player.delete({
        where: {
            id: id,
        },
    });

    if (!player) {
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
