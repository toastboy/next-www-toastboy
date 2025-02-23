import CountryFlag from 'components/CountryFlag/CountryFlag';
import { Player } from 'lib/types';
import countrySupporterService from 'services/CountrySupporter';

export interface Props {
    player: Player,
}

const PlayerCountries: React.FC<Props> = async ({ player }) => {
    const data = await countrySupporterService.getByPlayer(player.id);

    if (!data) return <></>;

    return (
        // TODO: Change styles to use Mantine components
        <div className="px-6 py-4">
            {data.map((item) => (
                <CountryFlag key={item.countryISOCode} country={item.country} />
            ))}
        </div>
    );
};

export default PlayerCountries;
