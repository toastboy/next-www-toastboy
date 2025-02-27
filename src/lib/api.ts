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
): Promise<Response> {
    try {
        const data = await serviceFunction({ params });

        switch (responseType) {
            case 'json':
                return Response.json(data, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            case 'png':
                return new Response(data as string, {
                    status: 200,
                    headers: {
                        'Content-Type': 'image/png',
                    },
                });
            default:
                throw new Error('Invalid response type');
        }
    } catch (error) {
        console.error(`Error in API route: ${error}`);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
