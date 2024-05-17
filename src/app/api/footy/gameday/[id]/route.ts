import gameDayService from "services/GameDay";
import { getGameDay } from "../common";
import { handleGET } from "../../common";

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
    handleGET(() => getGameDay(parseInt(params.id)), { params });
