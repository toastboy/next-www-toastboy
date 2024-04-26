export async function handleGET<T>(serviceFunction: () => Promise<T>) {
    try {
        const data = await serviceFunction();

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
