/**
 * Handles GET requests for API routes.
 *
 * @template T - The type of data returned by the service function.
 * @param {({ params }: { params: Record<string, string> }) => Promise<T>} serviceFunction - The service function to be called.
 * @param {{ params: Record<string, string> }} params - The parameters for the service function.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 */
export async function handleGET<T>(
    serviceFunction: ({ params }: { params: Record<string, string> }) =>
        Promise<T>, { params }: { params: Record<string, string> },
): Promise<Response> {
    try {
        const data = await serviceFunction({ params });

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    }
    catch (error) {
        console.error(`Error in API route: ${error} `);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
