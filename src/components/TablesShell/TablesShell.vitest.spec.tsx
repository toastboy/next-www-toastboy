import { render, screen } from '@testing-library/react';

import { TablesShell } from '@/components/TablesShell/TablesShell';
import { Wrapper } from '@/tests/components/lib/common';

vi.mock('@/components/TableIndexList/TableIndexList');

describe('TablesShell', () => {
    it('renders the heading and the table index list', () => {
        render(
            <Wrapper>
                <TablesShell />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { name: 'The League Tables' }),
        ).toBeInTheDocument();
        expect(screen.getByText('TableIndexList')).toBeInTheDocument();
    });
});
