import { Flex, Text, Title } from '@mantine/core';

import { FamilyTree } from '@/components/FamilyTree/FamilyTree';
import playerService from '@/services/Player';

export const metadata = { title: 'Family Tree' };

/**
 * Server page that renders a radial tree visualising how players were
 * introduced to the club. Fetches the full introduction hierarchy from the
 * Player service and passes it to the {@link FamilyTree} component.
 */
const FamilyTreePage = async () => {
    const tree = await playerService.getFamilyTree();

    return (
        <Flex direction="column" align="center" gap="lg">
            <Title order={2} mb="md">Toastboy FC Family Tree</Title>
            <Text mb="md">
                This tree shows how players were introduced to the club
                starting with Rob, the OG organiser before Jon took over in 1998.
                You can zoom in and scroll around to explore the tree,
                and click on any player to view their profile.
            </Text>
            <FamilyTree data={tree} />
        </Flex>
    );
};

export default FamilyTreePage;
