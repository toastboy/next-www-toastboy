import { renderToStaticMarkup } from 'react-dom/server';

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
