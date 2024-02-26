import { player } from '@prisma/client';
import clubSupporterService from 'services/club_supporter';

export default async function PlayerClubs({
    player,
}: {
    player: player,
}) {
    const club_supporters = await clubSupporterService.getByPlayer(player.id);

    if (club_supporters.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {club_supporters.map((item) => (
                <p key={item.clubId} className="text-gray-700 text-base">Club: {item.clubId}</p>
            ))}
        </div>
    );
}
