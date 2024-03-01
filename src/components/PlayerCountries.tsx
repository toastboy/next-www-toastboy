import { player } from '@prisma/client';
import countrySupporterService from 'services/CountrySupporter';
import countryService from 'services/Country';
import CountryFlag from 'components/CountryFlag';

export default async function PlayerClubs({
    player,
}: {
    player: player,
}) {
    const countrySupporters = await countrySupporterService.getByPlayer(player.id);

    if (countrySupporters.length === 0) {
        return null;
    }

    const countries = await Promise.all(countrySupporters.map(async (item) => {
        const club = await countryService.get(item.countryISOcode);
        return club;
    }));

    return (
        <div className="px-6 py-4">
            {countries.map((item) => (
                <CountryFlag key={item.isoCode} country={item} />
            ))}
        </div>
    );
}
