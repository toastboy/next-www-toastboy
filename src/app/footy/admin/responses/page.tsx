import { Container } from '@mantine/core';

import { AdminResponseRow, Responses } from '@/components/Responses/Responses';

// Temporary mock data until wired to backend
const mockGameId = 1249;
const mockGameDate = '3rd February 2026';
const mockResponses: AdminResponseRow[] = [
    {
        playerId: 1,
        playerName: 'Alex Keeper',
        response: 'Yes',
        goalie: true,
        comment: 'I can cover first half',
    },
    {
        playerId: 2,
        playerName: 'Britt Winger',
        response: 'No',
        goalie: false,
        comment: 'Out of town',
    },
    {
        playerId: 3,
        playerName: 'Casey Mid',
        response: null,
        goalie: false,
        comment: '',
    },
    {
        playerId: 4,
        playerName: 'Dev Striker',
        response: null,
        goalie: false,
        comment: '',
    },
];

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    const handleSave = async (update: {
        gameDayId: number;
        playerId: number;
        response: 'Yes' | 'No' | 'Dunno';
        goalie: boolean;
        comment: string;
    }) => {
        const res = await fetch('/api/footy/admin/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Failed to update response');
        }
    };

    return (
        <Container size="lg" py="lg">
            <Responses
                gameId={mockGameId}
                gameDate={mockGameDate}
                responses={mockResponses}
                onSave={handleSave}
            />
        </Container>
    );
};

export default Page;
