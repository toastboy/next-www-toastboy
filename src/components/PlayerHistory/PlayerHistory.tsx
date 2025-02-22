'use client';

import { Container } from '@mantine/core';
import PlayerPositions from 'components/PlayerPositions/PlayerPositions';
import PlayerResults from 'components/PlayerResults/PlayerResults';
import PlayerYearsActive from 'components/PlayerYearsActive/PlayerYearsActive';
import { Player } from 'lib/types';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
    player: Player;
}

const PlayerHistory: React.FC<Props> = ({ player }) => {
    const [activeYear, setActiveYear] = useState(0);

    useEffect(() => {
        if (isNaN(activeYear)) {
            return notFound();
        }
    }, [activeYear]);

    return (
        <Container>
            <PlayerYearsActive idOrLogin={player.login} activeYear={0} onYearChange={setActiveYear} />
            <PlayerResults idOrLogin={player.login} year={activeYear} />
            <PlayerPositions idOrLogin={player.login} year={activeYear} />
        </Container>
    );
};

export default PlayerHistory;
