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

    if (!clubSupporters || clubSupporters.length === 0) {
        return null;
    }

    const clubs = await Promise.all(clubSupporters.map(async (item) => {
        const club = await clubService.get(item.clubId);
        return club;
    }));

    const nonNullClubs = clubs.filter((item): item is NonNullable<typeof item> => item !== null);

    return (
        <div className="px-6 py-4">
            {nonNullClubs.map((item) => (
                <ClubBadge key={item.id} club={item} />
            ))}
        </div>
    );
}
