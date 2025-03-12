import { handleGET } from "lib/api";
import { NextRequest } from "next/server";
import countryService from "services/Country";

export async function generateStaticParams() {
    const countries = await countryService.getAll();

    return countries ? countries.map((club) => ({
        isoCode: club.isoCode.toString(),
    })) : null;
}

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => countryService.get(params.isoCode), { params });
};
