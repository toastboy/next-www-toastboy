import { Player } from '@prisma/client';
import clubSupporterService from 'services/ClubSupporter';
import clubService from 'services/Club';
import ClubBadge from 'components/ClubBadge';

export default async function PlayerClubs({
    player,
}: {
    player: Player,
}) {
    const clubSupporters = await clubSupporterService.getByPlayer(player.id);

    if (clubSupporters.length === 0) {
        return null;
    }

    const clubs = await Promise.all(clubSupporters.map(async (item) => {
        const club = await clubService.get(item.clubId);
        return club;
    }));

    return (
        <div className="px-6 py-4">
            {clubs.map((item) => (
                <ClubBadge key={item.id} club={item} />
            ))}
        </div>
    );
}
