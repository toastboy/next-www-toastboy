import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        player,
        table_year,
        game_day,
        responses,
        P,
        W,
        D,
        L,
        points,
        averages,
        stalwart,
        speedy_seconds,
        pub,
        rank_points,
        rank_averages,
        rank_stalwart,
        rank_speedy,
        rank_pub,
    } = await req.json();

    const standings = await prisma.standings.create({
        data: {
            player,
            table_year,
            game_day,
            responses,
            P,
            W,
            D,
            L,
            points,
            averages,
            stalwart,
            speedy_seconds,
            pub,
            rank_points,
            rank_averages,
            rank_stalwart,
            rank_speedy,
            rank_pub,
        },
    });

    return NextResponse.json({
        standings,
    });
};

export const GET = async () => {
    const standingss = await prisma.standings.findMany({});

    return NextResponse.json({
        standingss,
    });
};

// TODO: Another one where this should have some kind of composite unique index

// export const PUT = async (req: NextRequest) => {
//     const {
//         player,
//         table_year,
//         game_day,
//         responses,
//         P,
//         W,
//         D,
//         L,
//         points,
//         averages,
//         stalwart,
//         speedy,
//         pub,
//         rank_points,
//         rank_averages,
//         rank_stalwart,
//         rank_speedy,
//         rank_pub,
//     } = await req.json();

//     const standings = await prisma.standings.update({
//         where: {
//             id: Number(id),
//         },

//         data: {
//             player,
//             table_year,
//             game_day,
//             responses,
//             P,
//             W,
//             D,
//             L,
//             points,
//             averages,
//             stalwart,
//             speedy,
//             pub,
//             rank_points,
//             rank_averages,
//             rank_stalwart,
//             rank_speedy,
//             rank_pub,
//         },
//     });

//     return NextResponse.json({
//         standings,
//     });
// };

// export const DELETE = async (req: NextRequest) => {
//     const url = new URL(req.url).searchParams;
//     const id = Number(url.get("id")) || 0;

//     const standings = await prisma.standings.delete({
//         where: {
//             id: id,
//         },
//     });

//     if (!standings) {
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
