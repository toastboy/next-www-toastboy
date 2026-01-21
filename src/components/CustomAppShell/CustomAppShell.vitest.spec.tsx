
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { CustomAppShell } from '@/components/CustomAppShell/CustomAppShell';
import { Wrapper } from '@/tests/components/lib/common';

vi.mock('@/components/NavBarNested/NavBarNested');

describe('CustomAppShell', () => {
    it('renders app shell with header, navbar, and footer', () => {
        render(
            <Wrapper>
                <CustomAppShell>
                    <div>Test Content</div>
                </CustomAppShell>
            </Wrapper>,
        );

        expect(screen.getByText('Toastboy FC')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByText(/© 2025 Toastboy FC/i)).toBeInTheDocument();
    });
});
