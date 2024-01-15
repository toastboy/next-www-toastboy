import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        game_day,
        player,
        response,
        responsetime,
        points,
        team,
        comment,
        pub,
        paid,
        goalie,
    } = await req.json();

    const outcome = await prisma.outcome.create({
        data: {
            game_day,
            player,
            response,
            responsetime,
            points,
            team,
            comment,
            pub,
            paid,
            goalie,
        },
    });

    return NextResponse.json({
        outcome,
    });
};

export const GET = async () => {
    const outcomes = await prisma.outcome.findMany({});

    return NextResponse.json({
        outcomes,
    });
};

// TODO: These won't work because it seems the schema doesn't express that the
// unique index must be on both game_day and player.

// export const PUT = async (req: NextRequest) => {
//     const {
//         game_day,
//         player,
//         response,
//         responsetime,
//         points,
//         team,
//         comment,
//         pub,
//         paid,
//         goalie,
//     } = await req.json();

//     const outcome = await prisma.outcome.update({
//         where: {
//             game_day: game_day,
//         },

//         data: {
//             game_day,
//             player,
//             response,
//             responsetime,
//             points,
//             team,
//             comment,
//             pub,
//             paid,
//             goalie,
//         },
//     });

//     return NextResponse.json({
//         outcome,
//     });
// };

// export const DELETE = async (req: NextRequest) => {
//     const url = new URL(req.url).searchParams;
//     const game_day = Number(url.get("game_day")) || 0;

//     const outcome = await prisma.outcome.delete({
//         where: {
//             game_day: game_day,
//         },
//     });

//     if (!outcome) {
//         return NextResponse.json(
//             {
//                 message: "Error",
//             },
//             {
//                 status: 500,
//             }
//         );
//     }

//     return NextResponse.json({});
// };
