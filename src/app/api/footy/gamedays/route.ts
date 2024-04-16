import gameDayService from 'services/GameDay';

export async function GET() {
    try {
        const gameDays = await gameDayService.getAll();

        return new Response(JSON.stringify(gameDays), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    } catch (error) {
        console.error('Error fetching GameDays:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
