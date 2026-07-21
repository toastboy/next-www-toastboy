import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    List: ({ children }: { children?: unknown }) => children,
    ListItem: ({ children }: { children?: unknown }) => children,
    Paper: ({ children }: { children?: unknown }) => children,
    Stack: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

import TablesPage from '@/app/footy/tables/page';

describe('Tables page', () => {
    it('renders links to all league tables', () => {
        const html = renderToStaticMarkup(TablesPage());

        expect(html).toContain('href="/footy/table/points"');
        expect(html).toContain('href="/footy/table/averages"');
        expect(html).toContain('href="/footy/table/stalwart"');
        expect(html).toContain('href="/footy/table/speedy"');
    });
});
