import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        id,
        game_day,
        stamp,
        player,
        body,
    } = await req.json();

    const game_chat = await prisma.game_chat.create({
        data: {
            id,
            game_day,
            stamp,
            player,
            body,
        },
    });

    return NextResponse.json(game_chat);
};

export const GET = async () => {
    const game_chats = await prisma.game_chat.findMany({});

    return NextResponse.json(game_chats);
};

export const PUT = async (req: NextRequest) => {
    const {
        id,
        game_day,
        stamp,
        player,
        body,
    } = await req.json();

    const game_chat = await prisma.game_chat.update({
        where: {
            id: Number(id),
        },

        data: {
            id,
            game_day,
            stamp,
            player,
            body,
        },
    });

    return NextResponse.json(game_chat);
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const id = Number(url.get("id")) || 0;

    const game_chat = await prisma.game_chat.delete({
        where: {
            id: id,
        },
    });

    if (!game_chat) {
        return NextResponse.json({
            message: "Error",
            status: 500,
        });
    }

    return NextResponse.json({});
};
