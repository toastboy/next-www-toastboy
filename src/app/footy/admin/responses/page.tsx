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
    return (
        <Container size="lg" py="lg">
            <Responses
                gameId={mockGameId}
                gameDate={mockGameDate}
                responses={mockResponses}
            />
        </Container>
    );
};

export default Page;
