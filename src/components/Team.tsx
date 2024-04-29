'use client';

import TeamPlayer from 'components/TeamPlayer';
import { Loader } from '@mantine/core';
import { useTeam } from 'use/team';

export default function Team({
    gameDayId,
    team,
}: {
    gameDayId: number;
    team: 'A' | 'B';
}) {
    const { data, error, isLoading } = useTeam(gameDayId, team);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!data || data.length == 0) return null;

    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg">
            {data.map((o) => (
                <TeamPlayer key={o.playerId} idOrLogin={o.playerId.toString()} goalie={o.goalie} />
            ))}
        </div >
    );
}
