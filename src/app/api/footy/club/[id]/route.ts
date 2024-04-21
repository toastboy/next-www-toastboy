import clubService from "services/Club";
import { getClub } from "../common";

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

export async function GET(
    request: Request,
    { params }: {
        params: { id: string }
    },
) {
    try {
        const club = await getClub(parseInt(params.id));
        if (!club) {
            return new Response(`Club ${params.id} not found`, {
                status: 404,
            });
        }

        return new Response(JSON.stringify(club), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    }
    catch (error) {
        console.error('Error fetching club:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
