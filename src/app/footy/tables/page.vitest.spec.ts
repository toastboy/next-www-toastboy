import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    Stack: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/TableIndexList/TableIndexList');

import TablesPage from '@/app/footy/tables/page';

describe('Tables page', () => {
    it('renders the table index list', () => {
        const html = renderToStaticMarkup(TablesPage());

        expect(html).toContain('TableIndexList');
    });
});
