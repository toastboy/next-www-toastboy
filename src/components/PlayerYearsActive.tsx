import { Player } from '@prisma/client';
import playerService from 'services/Player';

export default async function PlayerYearsActive({
    player,
}: {
    player: Player,
}) {
    const distinctYears = await playerService.getYearsActive(player.id);

    if (!distinctYears) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            <p className="font-bold text-xl mb-2">Years Active</p>
            {distinctYears.map((year, index) => (
                <p key={index} className="text-gray-700 text-base">{year}</p>
            ))}
        </div>
    );
}
