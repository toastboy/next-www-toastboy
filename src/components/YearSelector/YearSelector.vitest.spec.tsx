import { fireEvent, render, screen } from '@testing-library/react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { Wrapper } from '../../tests/components/lib/common';
import { YearSelector } from './YearSelector';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
}));

describe('YearSelector', () => {
    const push = vi.fn();

    beforeEach(() => {
        vi.mocked(useRouter).mockReturnValue({
            push,
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
        } as AppRouterInstance);
        vi.mocked(usePathname).mockReturnValue('/footy/year/2024');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders years and navigates when a year is clicked', () => {
        render(
            <Wrapper>
                <YearSelector activeYear={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        expect(screen.getByRole('button', { name: '2024' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: '2023' }));

        expect(push).toHaveBeenCalledWith('/footy/year/2023');
    });

    it('navigates to the all-years view when "All" is clicked', () => {
        render(
            <Wrapper>
                <YearSelector activeYear={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'All' }));

        expect(push).toHaveBeenCalledWith('/footy/year/');
    });
});
