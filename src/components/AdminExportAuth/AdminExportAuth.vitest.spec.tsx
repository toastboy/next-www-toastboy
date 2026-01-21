import { render, screen } from '@testing-library/react';

import { AdminExportAuth } from '@/components/AdminExportAuth/AdminExportAuth';
import { Wrapper } from '@/tests/components/lib/common';

describe('AdminExportAuth', () => {
    it('renders export button', () => {
        render(
            <Wrapper>
                <AdminExportAuth />
            </Wrapper>,
        );

        expect(screen.getByRole('button', { name: /export auth data/i })).toBeInTheDocument();
    });
});
