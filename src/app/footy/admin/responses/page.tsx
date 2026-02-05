import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

import { SubmitAdminResponse } from '@/actions/submitAdminResponse';
import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';

type PageProps = object;

const Page: React.FC<PageProps> = async () => {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) return notFound();
    const responses = await outcomeService.getAdminByGameDay(currentGame.id);

    return (
        <Container size="lg" py="lg">
            <ResponsesForm
                gameId={currentGame.id}
                gameDate={currentGame.date.toISOString().split('T')[0]}
                responses={responses}
                submitAdminResponse={SubmitAdminResponse}
            />
        </Container>
    );
};

export default Page;
