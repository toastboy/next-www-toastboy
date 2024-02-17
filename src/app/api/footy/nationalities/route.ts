import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        id,
        player,
        iso_code,
    } = await req.json();

    const nationality = await prisma.nationality.create({
        data: {
            id,
            player,
            iso_code,
        },
    });

    return NextResponse.json(nationality);
};

export const GET = async () => {
    const nationalities = await prisma.nationality.findMany({});

    return NextResponse.json(nationalities);
};

export const PUT = async (req: NextRequest) => {
    const {
        id,
        player,
        iso_code,
    } = await req.json();

    const nationality = await prisma.nationality.update({
        where: {
            id: Number(id),
        },

        data: {
            id,
            player,
            iso_code,
        },
    });

    return NextResponse.json(nationality);
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const id = Number(url.get("id")) || 0;

    const nationality = await prisma.nationality.delete({
        where: {
            id: id,
        },
    });

    if (!nationality) {
        return NextResponse.json({
            message: "Error",
            status: 500,
        });
    }

    return NextResponse.json({});
};
