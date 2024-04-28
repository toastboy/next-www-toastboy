import GameDayLink from "components/GameDayLink";
import Team from "components/Team";
import { notFound } from "next/navigation";

export default function Page({
    params,
}: {
    params: { id: string },
}) {
    const gameDayId = parseInt(params.id);
    if (isNaN(gameDayId)) {
        return notFound();
    }

    return (
        <div>
            <main className="p-10 mx-auto max-w-4xl">
                <h1>Game {gameDayId}: <GameDayLink id={gameDayId} /></h1>
                <Team gameDayId={gameDayId} team={'A'} />
                <p>vs.</p>
                <Team gameDayId={gameDayId} team={'B'} />
            </main>

            <footer>
            </footer>
        </div>
    );
}
