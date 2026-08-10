'use client';

import { Card, Divider, Flex, Group } from '@mantine/core';

import { GoalieIndicator } from '@/components/GoalieIndicator/GoalieIndicator';
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
        <Card.Section w={{ base: '2.0rem', xs: '5.5rem' }}>
            <PlayerMugshot player={teamPlayer} />
        </Card.Section>

        <Card.Section px="md" py={2} flex={1}>
            <Flex
                align="center"
                direction={{ base: 'row', xs: 'column' }}
                justify={{ base: 'space-between', xs: 'center' }}
                h="100%"
            >
                <Group align="center" gap="xs" w={{ base: 'auto', xs: '100%' }}>
                    <PlayerLink
                        player={teamPlayer}
                        year={0}
                        wrap
                        ta={{ base: 'left', xs: 'center' }}
                        w={{ base: 'auto', xs: '100%' }}
                    />
                </Group>
                <Divider
                    visibleFrom="xs"
                    w="75%"
                    mt="xs"
                    mb={0}
                    label={
                        teamPlayer.outcome.goalie ? (
                            <GoalieIndicator />
                        ) : undefined
                    }
                />
                <Group gap="xs" wrap="nowrap">
                    {teamPlayer.outcome.goalie ? (
                        <GoalieIndicator hiddenFrom="xs" />
                    ) : null}
                    <PlayerForm form={teamPlayer.form} />
                </Group>
            </Flex>
        </Card.Section>
    </Card>
);
