import { handleGET } from "lib/api";
import { NextRequest } from "next/server";
import outcomeService from "services/Outcome";

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    console.log("GET /api/footy/bibs");
    const params = await props.params;
    const searchParams = request.nextUrl.searchParams;
    return handleGET(() => outcomeService.getByBibs({ year: parseInt(searchParams.get('year') || '') || undefined }), { params });
};
