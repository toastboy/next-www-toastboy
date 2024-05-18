import gameDayService from "services/GameDay";
import { handleGET } from "lib/api";

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

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => gameDayService.get(parseInt(params.id)), { params });
