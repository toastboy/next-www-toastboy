import { handleGET } from "lib/api";
import clubService from "services/Club";

export async function generateStaticParams() {
    const clubs = await clubService.getAll();

    return clubs ? clubs.map((club) => ({
        id: club.id.toString(),
    })) : null;
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => clubService.get(parseInt(params.id)), { params });
