import GameDay from "components/GameDay";
import { notFound } from "next/navigation";

interface PageProps {
    params: Record<string, string>;
}

const Page: React.FC<PageProps> = ({ params }) => {
    const gameDayId = parseInt(params.id);
    if (isNaN(gameDayId)) {
        return notFound();
    }

    return (
        <GameDay id={gameDayId} />
    );
};

export default Page;
