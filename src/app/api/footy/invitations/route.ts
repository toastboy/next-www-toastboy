import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        uuid,
        player,
        game_day,
    } = await req.json();

    const invitation = await prisma.invitation.create({
        data: {
            uuid,
            player,
            game_day,
        },
    });

    return NextResponse.json({
        invitation,
    });
};

export const GET = async () => {
    const invitations = await prisma.invitation.findMany({});

    return NextResponse.json({
        invitations,
    });
};

export const PUT = async (req: NextRequest) => {
    const {
        uuid,
        player,
        game_day,
    } = await req.json();

    const invitation = await prisma.invitation.update({
        where: {
            uuid: uuid,
        },

        data: {
            uuid,
            player,
            game_day,
        },
    });

    return NextResponse.json({
        invitation,
    });
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const uuid = url.get("id") || "";

    const invitation = await prisma.invitation.delete({
        where: {
            uuid: uuid,
        },
    });

    if (!invitation) {
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
