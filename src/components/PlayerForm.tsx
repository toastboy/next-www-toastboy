import { Player } from '@prisma/client';
import playerService from 'services/Player';

export default async function PlayerForm({
    player,
    games,
}: {
    player: Player,
    games: number,
}) {
    const outcomes = await playerService.getForm(player.id, 0, games);

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
