'use client';

import { Flex, Text, Title } from '@mantine/core';

import { FamilyTree } from '@/components/FamilyTree/FamilyTree';
import type { FamilyTreeNodeType } from '@/types';

export interface Props {
    data: FamilyTreeNodeType;
}

export const FamilyTreeShell = ({ data }: Props) => {
    return (
        <Flex
            direction="column"
            align="center"
            gap="lg"
        >
            <Title
                order={2}
                mb="md"
            >
                Toastboy FC Family Tree
            </Title>
            <Text mb="md">
                This tree shows how players were introduced to the club starting
                with Rob, the OG organiser before Jon took over in 1998. You can
                zoom in and scroll around to explore the tree, and click on any
                player to view their profile.
            </Text>
            <FamilyTree data={data} />
        </Flex>
    );
};
