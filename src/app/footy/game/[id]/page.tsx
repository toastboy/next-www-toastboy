import TeamPlayer from "components/TeamPlayer";
import { notFound } from "next/navigation";
import gameDayService from "services/GameDay";
import outcomeService from "services/Outcome";

export default async function Page({
    params,
}: {
    params: { id: string },
})
    : Promise<JSX.Element> {
    const gameDayId = parseInt(params.id);
    if (isNaN(gameDayId)) {
        return notFound();
    }

    const gameDay = await gameDayService.get(gameDayId);
    if (!gameDay) {
        return notFound();
    }

    const outcomes = await outcomeService.getByGameDay(gameDayId);
    if (!outcomes) {
        return notFound();
    }

    return (
        <div>
            <main className="p-10 mx-auto max-w-4xl">
                <h1>Game {gameDay.id}: {gameDay.date.toLocaleDateString('en-GB', {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}</h1>
                {outcomes.filter(o => o.team == "A").map((o) => (
                    <TeamPlayer key={o.playerId} idOrLogin={o.playerId.toString()} />
                ))}
                <p>vs.</p>
                {outcomes.filter(o => o.team == "B").map((o) => (
                    <TeamPlayer key={o.playerId} idOrLogin={o.playerId.toString()} />
                ))}
            </main>

            <footer>
            </footer>
        </div>
    );
}
