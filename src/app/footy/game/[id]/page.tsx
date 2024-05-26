import { notFound } from "next/navigation";
import GameDay from "components/GameDay";

export default function Page({
    params,
}: {
    params: Record<string, string>,
}) {
    const gameDayId = parseInt(params.id);
    if (isNaN(gameDayId)) {
        return notFound();
    }

    return (
        <GameDay id={gameDayId} />
    );
}
