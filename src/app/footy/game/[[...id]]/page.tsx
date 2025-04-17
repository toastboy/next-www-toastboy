export const dynamic = 'force-dynamic';

import { Anchor, Flex } from "@mantine/core";
import { GameDay } from "@prisma/client";
import GameDaySummary from "components/GameDaySummary/GameDaySummary";
import { fetchData } from "lib/fetch";
import { notFound, redirect } from "next/navigation";
import gameDayService from "services/GameDay";

interface Props {
    params: Promise<{
        id: string,
    }>,
}

const Page: React.FC<Props> = async (props) => {
    const { id } = await props.params;
    if (!id) {
        const currentGame = await fetchData<GameDay>('/api/footy/currentgame');
        redirect(`/footy/game/${currentGame.id}`);
    }
    const gameDayId = parseInt(id);

    if (isNaN(gameDayId)) return notFound();

    const gameDay = await gameDayService.get(gameDayId);

    if (!gameDay) return <></>;

    return (
        // TODO: Clean up the previous and next links
        <Flex w="100%" direction="column">
            <Anchor href={`/footy/game/${gameDayId - 1}`} ta="left">Back</Anchor>
            <Anchor href={`/footy/game/${gameDayId + 1}`} ta="right">Forward</Anchor>
            <GameDaySummary gameDay={gameDay} />
        </Flex>
    );
};

export default Page;
