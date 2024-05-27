'use client';

import { Player } from '@prisma/client';
import PlayerMugshot from 'components/PlayerMugshot';
import PlayerArse from 'components/PlayerArse';
import PlayerClubs from 'components/PlayerClubs';
import PlayerCountries from 'components/PlayerCountries';
import PlayerForm from 'components/PlayerForm';
import PlayerLastPlayed from 'components/PlayerLastPlayed';
import PlayerYearsActive from 'components/PlayerYearsActive';
import PlayerResults from 'components/PlayerResults';
import PlayerPositions from 'components/PlayerPositions';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PlayerProfileProps {
    player: Player;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player }) => {
    const [activeYear, setActiveYear] = useState(0);

    useEffect(() => {
        if (isNaN(activeYear)) {
            return notFound();
        }
    }, [activeYear]);

    const { id, login, name, email, born } = player;
    const born_string = born == null ? "Unknown" : born.toLocaleDateString('sv');

    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg" key={id}>
            <h1 className="text-6xl font-bold mb-4 text-center">{name}</h1>
            <PlayerMugshot idOrLogin={player.login} />
            <PlayerLastPlayed idOrLogin={player.login} />
            <PlayerClubs idOrLogin={player.login} />
            <PlayerCountries idOrLogin={player.login} />
            <PlayerArse idOrLogin={player.login} />
            <PlayerForm idOrLogin={player.login} games={5} />
            <PlayerYearsActive idOrLogin={player.login} activeYear={0} onYearChange={setActiveYear} />
            <PlayerResults idOrLogin={player.login} year={activeYear} />
            <PlayerPositions idOrLogin={player.login} year={activeYear} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{name}</div>
                <p className="text-gray-700 text-base">{email}</p>
                <p className="text-gray-900 text-xl">{login}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {born_string}
                </span>
            </div>
        </div>
    );
};

export default PlayerProfile;
