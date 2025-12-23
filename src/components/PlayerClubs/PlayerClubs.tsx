import { Flex } from '@mantine/core';
import { Activity } from 'react';

import { ClubBadge } from '@/components/ClubBadge/ClubBadge';
import { ClubSupporterDataType } from '@/types';

export interface Props {
    clubs: ClubSupporterDataType[];
}

export const PlayerClubs: React.FC<Props> = ({ clubs }) => {
    return (
        <Activity mode={clubs.length > 0 ? 'visible' : 'hidden'}>
            <Flex gap="xs" p="xs" direction="column">
                {clubs.map((item) => (
                    <ClubBadge
                        key={item.clubId}
                        club={item.club}
                    />
                ))}
            </Flex>
        </Activity>
    );
};
