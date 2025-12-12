jest.mock('components/NavBarNested/NavBarNested', () => {
    const MockNavBarNested = () => <div data-testid="mock-navbar-nested" />;
    MockNavBarNested.displayName = 'MockNavBarNested';
    return MockNavBarNested;
});

import { render, screen } from '@testing-library/react';

import CustomAppShell from '@/components/CustomAppShell/CustomAppShell';

import { Wrapper } from './lib/common';

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
