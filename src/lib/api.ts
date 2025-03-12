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
    responseType: 'json' | 'png' = 'json',
): Promise<NextResponse> {
    try {
        const data = await serviceFunction({ params });

        if (data != null) {
            const headers: HeadersInit = {
                'Content-Type': responseType === 'json' ? 'application/json' : 'image/png',
            };
            const body = responseType === 'json' ? JSON.stringify(data) : data as string;
            return new NextResponse(body, {
                status: 200,
                headers,
            });
        } else {
            return new NextResponse(
                responseType === 'json' ? 'Data not found' : 'PNG image not found',
                {
                    status: 404,
                },
            );
        }
    } catch (error) {
        console.error(`Error in API route: ${error}`);
        return new NextResponse('Internal Server Error', {
            status: 500,
        });
    }
}
