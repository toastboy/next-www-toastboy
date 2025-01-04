import { handleGET } from 'lib/api';
import playerService from 'services/Player';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => playerService.getByIdOrLogin(params.idOrLogin), { params });
};
