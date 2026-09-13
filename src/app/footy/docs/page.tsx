import type { Metadata } from 'next';

import type { DocLink } from '@/components/DocsIndex/DocsIndex';
import { DocsIndex } from '@/components/DocsIndex/DocsIndex';

export const metadata: Metadata = { title: 'Documentation' };

const docs: DocLink[] = [
    {
        href: '/footy/docs/privacy',
        title: 'Privacy Notice',
        description:
            'What personal data the club holds, why we hold it, how long we keep it, and your rights under UK data protection law.',
    },
    {
        href: '/footy/docs/admin',
        title: 'Admin Documentation',
        description:
            'How to manage games, players and money on the site once you have been granted admin access.',
    },
    {
        href: '/footy/docs/migration',
        title: 'Migrating to the New Footy Site',
        description:
            'What changed when the site moved to its current version, and what existing players need to do.',
    },
];

const DocsIndexPage = () => <DocsIndex docs={docs} />;

export default DocsIndexPage;
