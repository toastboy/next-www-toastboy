export const dynamic = 'force-dynamic';

import { Paper, Text, Title } from '@mantine/core';

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
        <Paper shadow="xl" p="xl">
            <Title order={2} mb="md">Toastboy FC Family Tree</Title>
            <Text mb="md">
                This tree shows how players were introduced to the club.
                Only players who are part of an introduction chain are shown
                &mdash; founders who introduced others branch from the centre.
                Click a player to view their profile.
            </Text>
            <FamilyTree data={tree} />
        </Paper>
    );
};

export default FamilyTreePage;
