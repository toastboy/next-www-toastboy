import { handleGET } from "lib/api";
import countryService from "services/Country";

export async function generateStaticParams() {
    const countries = await countryService.getAll();

    return countries ? countries.map((country) => {
        return {
            params: {
                isoCode: country.isoCode,
            },
        };
    }) : null;
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => countryService.get(params.isoCode), { params });
