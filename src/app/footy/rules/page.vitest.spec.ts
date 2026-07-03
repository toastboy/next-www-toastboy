import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    Flex: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

import RulesPage from '@/app/footy/rules/page';

describe('Rules page', () => {
    it('renders the rules content', () => {
        const html = renderToStaticMarkup(RulesPage());

        expect(html).toContain('Toastboy FC: Rules');
        expect(html).toContain('After every game, we retire to a local pub for a few');
    });
});
