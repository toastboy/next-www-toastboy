import { Container } from '@mantine/core';
import type { Metadata } from 'next';

import MigrationContent from './migration.mdx';

export const metadata: Metadata = { title: 'Migrating to the New Footy Site' };

const MigrationPage = () => (
    <Container py="xl">
        <MigrationContent />
    </Container>
);

export default MigrationPage;
