'use client';

import { Loader } from '@mantine/core';
import TeamPlayer from 'components/TeamPlayer/TeamPlayer';
import { useTeam } from 'lib/swr';

interface TeamProps {
    gameDayId: number;
    team: 'A' | 'B';
}

const Team: React.FC<TeamProps> = ({ gameDayId, team }) => {
    const { data, error, isLoading } = useTeam(gameDayId, team);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length === 0) return <div>failed to load</div>;

    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg">
            {data.map((o) => (
                <TeamPlayer key={o.playerId} idOrLogin={o.playerId.toString()} goalie={o.goalie} />
            ))}
        </div>
    );
};

export default Team;
