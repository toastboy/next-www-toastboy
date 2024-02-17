import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import debug from 'debug';

const log = debug('footy:api');

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        game_number,
        game_date,
        game,
        mail_sent,
        comment,
        bibs,
        picker_games_history,

    } = await req.json();

    const game_day = await prisma.game_day.create({
        data: {
            game_number,
            game_date,
            game,
            mail_sent,
            comment,
            bibs,
            picker_games_history,

        },
    });

    return NextResponse.json(game_day);
};

export const GET = async () => {
    try {
        const game_days = await prisma.game_day.findMany({});

        return NextResponse.json(game_days);
    } catch (error) {
        log('Error in GET:', error);
        return new NextResponse('Error fetching data', { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    const {
        game_number,
        game_date,
        game,
        mail_sent,
        comment,
        bibs,
        picker_games_history,

    } = await req.json();

    const game_day = await prisma.game_day.update({
        where: {
            game_number: Number(game_number),
        },

        data: {
            game_number,
            game_date,
            game,
            mail_sent,
            comment,
            bibs,
            picker_games_history,

        },
    });

    return NextResponse.json(game_day);
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const game_number = Number(url.get("game_number")) || 0;

    const game_day = await prisma.game_day.delete({
        where: {
            game_number: game_number,
        },
    });

    if (!game_day) {
        return NextResponse.json({
            message: "Error",
            status: 500,
        });
    }

    return NextResponse.json({});
};
