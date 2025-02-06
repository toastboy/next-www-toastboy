import { handleGET } from 'lib/api';
import gameDayService from 'services/GameDay';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => gameDayService.getCurrent(), { params });
};
