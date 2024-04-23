import gameDayService from "services/GameDay";
import { getGameDay } from "../common";

export async function generateStaticParams() {
    const gameDays = await gameDayService.getAll();

    return gameDays ? gameDays.map((gameDay) => {
        return {
            params: {
                id: gameDay.id,
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
        const gameDay = await getGameDay(parseInt(params.id));
        if (!gameDay) {
            return new Response(`GameDay ${params.id} not found`, {
                status: 404,
            });
        }

        return new Response(JSON.stringify(gameDay), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    }
    catch (error) {
        console.error('Error fetching GameDay:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
