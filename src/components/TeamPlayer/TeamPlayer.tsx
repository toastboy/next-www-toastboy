'use client';

import {
    Card,
    Flex,
    Group,
} from '@mantine/core';

import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { PlayerMugshot } from '@/components/PlayerMugshot/PlayerMugshot';
import { TeamPlayerType } from '@/types';


export interface Props {
    teamPlayer: TeamPlayerType;
}

export const TeamPlayer = ({ teamPlayer }: Props) => (
    // `padding` (Card's own prop) zeroes --card-padding, which Card.Section's
    // horizontal-orientation negative-margin layout depends on — without it,
    // sections collapse to a few px tall. `p` (the generic style prop) is
    // needed too: `padding` is stripped before Card forwards its remaining
    // props to the underlying Paper, whose project-wide default is p="xl".
    <Card p={0} padding={0} withBorder orientation="horizontal">
        <Card.Section w={{ base: "2.0rem", xs: "5.5rem" }}>
            <PlayerMugshot
                player={teamPlayer}
            />
        </Card.Section>

        <Card.Section px="md" py={2}>
            <Flex direction={{ base: "row", xs: "column" }} justify="center" h="100%">
                <Group align="center" gap="xs">
                    <PlayerLink player={teamPlayer} year={0} wrap goalie={teamPlayer.outcome.goalie} />
                    {/* {teamPlayer.outcome.goalie ? <GoalieIndicator /> : null} */}
                </Group>
                <PlayerForm form={teamPlayer.form} />
            </Flex>
        </Card.Section>
    </Card>
);
