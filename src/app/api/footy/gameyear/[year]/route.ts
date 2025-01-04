import { handleGET } from 'lib/api';
import gameDayService from 'services/GameDay';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => {
        if (parseInt(params.year) === 0) return Promise.resolve(true);
        return gameDayService.getYear(
            parseInt(params.year)).then((year) =>
                Promise.resolve(year == parseInt(params.year) ? true : null));
    }, { params });
};
