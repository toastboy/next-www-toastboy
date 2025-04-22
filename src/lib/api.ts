import { NextResponse } from "next/server";

/**
 * Handles a GET request by invoking a service function and returning the appropriate response.
 *
 * @template T - The type of the data returned by the service function.
 * @param serviceFunction - A function that takes an object with `params` and returns a Promise resolving to data of type `T` or null.
 * @param params - An object containing the parameters to be passed to the service function.
 * @param responseType - The type of response to return, either 'json' or 'png'.
 * @returns A Promise that resolves to a Response object. The response will have a status of 200 if data is found,
 *          404 if data is not found, or 500 if an error occurs.
 */
export async function handleGET<T>(
    serviceFunction: ({ params }: { params: Record<string, string> }) => Promise<T | null>,
    { params }: { params: Record<string, string> },
    buildResponse: (data: T) => Promise<NextResponse> = buildJsonResponse,
): Promise<NextResponse> {
    const data = await serviceFunction({ params });

    if (data == null) return new NextResponse('Not Found', { status: 404 });

    return buildResponse(data);
}

export async function buildJsonResponse<T>(data: T): Promise<NextResponse> {
    return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function buildPngResponse<T>(data: T): Promise<NextResponse> {
    return new NextResponse(data as Buffer, {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
    });
}
