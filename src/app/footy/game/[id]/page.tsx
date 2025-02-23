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

    return <GameDaySummary gameDay={gameDay} />;
};

export default Page;
