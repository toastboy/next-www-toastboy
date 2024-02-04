import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const {
        iso_code,
        country_name,
    } = await req.json();

    const country = await prisma.country.create({
        data: {
            iso_code,
            country_name,
        },
    });

    return NextResponse.json({
        country,
    });
};

export const GET = async () => {
    const countrys = await prisma.country.findMany({});

    return NextResponse.json({
        countrys,
    });
};

export const PUT = async (req: NextRequest) => {
    const {
        iso_code,
        country_name,
    } = await req.json();

    const country = await prisma.country.update({
        where: {
            iso_code: iso_code,
        },

        data: {
            iso_code,
            country_name,
        },
    });

    return NextResponse.json({
        country,
    });
};

export const DELETE = async (req: NextRequest) => {
    const url = new URL(req.url).searchParams;
    const iso_code = url.get("iso_code") || "";

    const country = await prisma.country.delete({
        where: {
            iso_code: iso_code,
        },
    });

    if (!country) {
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
