import GameDay from "components/GameDay";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>,
}

const Page: React.FC<PageProps> = async props => {
    const { id } = await props.params;
    const gameDayId = parseInt(id);

    if (isNaN(gameDayId)) {
        return notFound();
    }

    return (
        <GameDay id={gameDayId} />
    );
};

export default Page;
