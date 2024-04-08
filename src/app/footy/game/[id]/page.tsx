import Team from "components/Team";
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

    const teamA = outcomes.filter(o => o.team == "A");
    const teamB = outcomes.filter(o => o.team == "B");

    return (
        <div>
            <main className="p-10 mx-auto max-w-4xl">
                <h1>Game {gameDay.id}: {gameDay.date.toLocaleDateString('en-GB', {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}</h1>
                <Team outcomes={teamA} />
                <p>vs.</p>
                <Team outcomes={teamB} />
            </main>

            <footer>
            </footer>
        </div>
    );
}
