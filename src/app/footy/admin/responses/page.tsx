import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

import { SubmitResponse } from '@/actions/submitResponse';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import { formatDate } from '@/lib/dates';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Responses' };

const ResponsesPage = async () => {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) return notFound();
    const responses = await outcomeService.getAdminByGameDay(currentGame.id);

    return (
        <Container size="lg" py="lg">
            <AutoRefresh channels={FootyChannel.Responses} />
            <ResponsesForm
                gameId={currentGame.id}
                gameDate={formatDate(currentGame.date)}
                responses={responses}
                submitResponse={SubmitResponse}
            />
        </Container>
    );
};

export default ResponsesPage;
