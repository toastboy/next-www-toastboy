'use client';

import { player, arse } from '@prisma/client';
import { playerService } from "lib/player";
import PlayerMugshot from 'components/PlayerMugshot';
import { useEffect, useState } from 'react';
import arseService from 'lib/arse';

export default function PlayerProfile({
    player,
}: {
    player: player,
}) {
    const { id, login, first_name, last_name, email, born } = player;
    const born_string = born == null ? "Unknown" : born.toLocaleDateString('sv');
    const [arse, setArse] = useState(null);

    useEffect(() => {
        async function fetchArse() {
            const arse: arse = await arseService.get(1);
            setArse(arse.rater.toString());
        }
        fetchArse();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg" key={id}>
            <h1 className="text-6xl font-bold mb-4 text-center">{playerService.getName(player)}</h1>
            <PlayerMugshot player={player} />
            <div className="px-6 py-4">
                <p className="text-gray-900 text-xl">The Arse: {arse}</p>
            </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{first_name} {last_name}</div>
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
}
