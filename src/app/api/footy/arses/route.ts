import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        id,
        stamp,
        player,
        rater,
        in_goal,
        running,
        shooting,
        passing,
        ball_skill,
        attacking,
        defending,
    } = await req.json();

    const arse = await prisma.arse.create({
        data: {
            id,
            stamp,
            player,
            rater,
            in_goal,
            running,
            shooting,
            passing,
            ball_skill,
            attacking,
            defending,
        },
    });

    return NextResponse.json({
        arse,
    });
};

export const GET = async () => {
    const arses = await prisma.arse.findMany({});

    return NextResponse.json({
        arses,
    });
};

export const PUT = async (req: NextRequest) => {
    const {
        id,
        stamp,
        player,
        rater,
        in_goal,
        running,
        shooting,
        passing,
        ball_skill,
        attacking,
        defending,
    } = await req.json();

    const arse = await prisma.arse.update({
        where: {
            id: Number(id),
        },

        data: {
            id,
            stamp,
            player,
            rater,
            in_goal,
            running,
            shooting,
            passing,
            ball_skill,
            attacking,
            defending,
        },
    });

    return NextResponse.json({
        arse,
    });
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const id = Number(url.get("id")) || 0;

    const arse = await prisma.arse.delete({
        where: {
            id: id,
        },
    });

    if (!arse) {
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
