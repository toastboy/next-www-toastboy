import gameDayService from 'services/GameDay';
import { handleGET } from 'lib/api';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => gameDayService.getAll(), { params });
};
