import countryService from "services/Country";
import { getCountry } from "../common";

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

export async function GET(
    request: Request,
    { params }: {
        params: { isoCode: string }
    },
) {
    const { isoCode } = params;

    try {
        const country = await getCountry(isoCode);
        if (!country) {
            return new Response(`Country ${isoCode} not found`, {
                status: 404,
            });
        }

        return new Response(JSON.stringify(country), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    }
    catch (error) {
        console.error('Error fetching country:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
