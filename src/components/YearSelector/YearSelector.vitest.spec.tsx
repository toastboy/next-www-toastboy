import { render, screen } from '@testing-library/react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { Wrapper } from '../../tests/components/lib/common';
import { YearSelector } from './YearSelector';

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

        expect(screen.getByTestId('year-selector-button-2024')).toBeInTheDocument();

        const button2023 = screen.getByTestId('year-selector-button-2023');
        const href = button2023.getAttribute('href');
        expect(href).toBeTruthy();

        const url = new URL(href!, 'http://localhost');
        expect(url.searchParams.get('year')).toBe('2023');
    });

    it('navigates to the all-years view when "All" is clicked', () => {
        render(
            <Wrapper>
                <YearSelector activeYear={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        const button0 = screen.getByTestId('year-selector-button-0');
        const href = button0.getAttribute('href');
        expect(href).toBeTruthy();

        const url = new URL(href!, 'http://localhost');
        expect(url.searchParams.get('year')).toBeNull();
    });
});
