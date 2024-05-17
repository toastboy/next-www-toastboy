import countryService from "services/Country";
import { handleGET } from "../../common";

export async function generateStaticParams() {
    const countries = await countryService.getAll();

    return countries ? countries.map((country) => {
        return {
            params: {
                id: country.isoCode,
            },
        };
    }) : null;
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => countryService.get(params.isoCode), { params });
