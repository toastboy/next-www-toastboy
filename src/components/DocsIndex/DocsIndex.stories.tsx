import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DocsIndex } from './DocsIndex';

const meta = {
    title: 'Utilities/DocsIndex',
    component: DocsIndex,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DocsIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        docs: [
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
        ],
    },
};
