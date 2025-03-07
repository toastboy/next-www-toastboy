import { Anchor, Flex } from "@mantine/core";
import GameDaySummary from "components/GameDaySummary/GameDaySummary";
import { notFound } from "next/navigation";
import gameDayService from "services/GameDay";

interface Props {
    params: Promise<{
        id: string,
    }>,
}

const Page: React.FC<Props> = async (props) => {
    const { id } = await props.params;
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
