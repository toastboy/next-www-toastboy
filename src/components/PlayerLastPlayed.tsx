import { Player } from '@prisma/client';
import playerService from 'services/Player';

export default async function PlayerLastPlayed({
    player,
}: {
    player: Player,
}) {
    const outcome = await playerService.getLastPlayed(player.id);

    if (!outcome) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">Last played: {outcome.gameDay.date.toLocaleDateString('sv')}</p>
        </div>
    );
}
