import type { Metadata } from 'next';

import MigrationContent from './migration.mdx';

export const metadata: Metadata = { title: 'Migrating to the New Footy Site' };

const MigrationPage = () => <MigrationContent />;

export default MigrationPage;
