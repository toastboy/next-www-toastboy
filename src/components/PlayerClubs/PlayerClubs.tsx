import { Flex } from '@mantine/core';

import { ClubBadge } from '@/components/ClubBadge/ClubBadge';
import { ClubSupporterDataType } from '@/types';

export interface Props {
    clubs: ClubSupporterDataType[];
}

export const PlayerClubs = ({ clubs }: Props) => {
    return clubs.length > 0 ? (
        <Flex gap="2cqw" p="1cqw" direction="column">
            {clubs.map((item) => (
                <ClubBadge
                    key={item.clubId}
                    club={item.club}
                    w="12cqw"
                    h="auto"
                />
            ))}
        </Flex>
    ) : null;
};
