import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

import { SubmitResponse } from '@/actions/submitResponse';
import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import { formatDate } from '@/lib/bankHolidays';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';

export const metadata = { title: 'Responses' };

const ResponsesPage = async () => {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) return notFound();
    const responses = await outcomeService.getAdminByGameDay(currentGame.id);

    return (
        <Container size="lg" py="lg">
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
