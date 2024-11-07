import { handleGET } from "lib/api";
import gameDayService from "services/GameDay";

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => gameDayService.get(parseInt(params.id)), { params });
