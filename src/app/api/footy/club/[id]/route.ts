import { handleGET } from "lib/api";
import { NextRequest } from "next/server";
import clubService from "services/Club";

export async function generateStaticParams() {
    const clubs = await clubService.getAll();

    return clubs ? clubs.map((club) => ({
        id: club.id.toString(),
    })) : null;
}

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => clubService.get(parseInt(params.id)), { params });
};
