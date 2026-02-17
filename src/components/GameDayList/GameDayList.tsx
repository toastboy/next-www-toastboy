import { List, ListItem, Text } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';

export interface Props {
    gameDays: GameDayType[];
}

export const GameDayList: React.FC<Props> = ({ gameDays }) => {
    if (gameDays.length === 0) {
        return <Text c="dimmed">No results yet.</Text>;
    }

    return (
        <List>
            {gameDays.map((gameDay) => (
                <ListItem key={gameDay.id}>
                    <GameDayLink gameDay={gameDay} />
                </ListItem>
            ))}
        </List>
    );
};
