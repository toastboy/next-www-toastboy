import gameDayService from 'services/GameDay';

export async function GET() {
    try {
        const distinctYears = await gameDayService.getAllYears();

        return new Response(JSON.stringify(distinctYears), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    }
    catch (error) {
        console.error(`Error im API route: ${error} `);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
