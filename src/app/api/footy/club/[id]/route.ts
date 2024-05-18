import clubService from "services/Club";
import { handleGET } from "lib/api";

export async function generateStaticParams() {
    const clubs = await clubService.getAll();

    return clubs ? clubs.map((club) => {
        return {
            params: {
                id: club.id,
            },
        };
    }) : null;
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => clubService.get(parseInt(params.id)), { params });
