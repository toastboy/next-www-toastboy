/**
 * Handles GET requests for API routes where the return type is JSON.
 *
 * @template T - The type of data returned by the service function.
 * @param {({ params }: { params: Record<string, string> }) => Promise<T>} serviceFunction - The service function to be called.
 * @param {{ params: Record<string, string> }} params - The parameters for the service function.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 */
export async function handleGET<T>(
    serviceFunction: ({ params }: { params: Record<string, string> }) =>
        Promise<T | null>, { params }: { params: Record<string, string> },
): Promise<Response> {
    try {
        const data = await serviceFunction({ params });

        if (data != null) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        else {
            return new Response(`Data not found`, {
                status: 404,
            });
        }
    }
    catch (error) {
        console.error(`Error in API route: ${error} `);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}

/**
 * Handles GET requests for API routes where the return type is PNG.
 *
 * @param {({ params }: { params: Record<string, string> }) => Promise<Buffer>} serviceFunction - The service function to be called.
 * @param {{ params: Record<string, string> }} params - The parameters for the service function.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 */
export async function handleGETPNG(
    serviceFunction: ({ params }: { params: Record<string, string> }) =>
        Promise<Buffer | null>, { params }: { params: Record<string, string> },
): Promise<Response> {
    try {
        const data = await serviceFunction({ params });

        if (data) {
            return new Response(data, {
                status: 200,
                headers: {
                    'Content-Type': 'image/png',
                },
            });
        }
        else {
            return new Response(`PNG image not found`, {
                status: 404,
            });
        }
    }
    catch (error) {
        console.error(`Error in API route: ${error} `);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
