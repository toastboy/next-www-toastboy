import { Player } from '@prisma/client';
import outcomeService from 'services/Outcome';

export default async function PlayerForm({
    player,
}: {
    player: Player,
}) {
    const outcomes = await outcomeService.getPlayerForm(player.id, 0, 10);

    if (!outcomes || outcomes.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {outcomes.map((outcome, index) => (
                <p key={index} className="text-gray-700 text-base">Game {outcome.gameDay.date.toLocaleDateString('sv')}: {outcome.points}</p>
            ))}
        </div>
    );
}
