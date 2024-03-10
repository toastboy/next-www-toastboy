import { Player } from '@prisma/client';
import outcomeService from 'services/Outcome';

export default async function PlayerLastPlayed({
    player,
}: {
    player: Player,
}) {
    const outcome = await outcomeService.getPlayerLastPlayed(player.id);

    if (!outcome) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">Last played: {outcome.gameDay.date.toLocaleDateString('sv')}</p>
        </div>
    );
}
