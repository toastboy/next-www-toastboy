import { render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { vi } from 'vitest';

import { Wrapper } from '../../tests/components/lib/common';
import { TitleWithYearDropdown } from './TitleWithYearDropdown';

describe('TitleWithYearDropdown', () => {
    const push = vi.fn();

    beforeEach(() => {
        vi.mocked(useRouter).mockReturnValue({
            push,
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
        });
        vi.mocked(usePathname).mockReturnValue('/footy/year/2024');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the title', () => {
        render(
            <Wrapper>
                <TitleWithYearDropdown title="Testing Title" order={2} year={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        expect(screen.getByText('Testing Title')).toBeInTheDocument();
    });

    it('shows the active year in the trigger button', () => {
        render(
            <Wrapper>
                <TitleWithYearDropdown title="Testing Title" order={2} year={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        expect(screen.getByRole('button')).toHaveTextContent('2024');
    });

    it('shows "All Time" in the trigger when year is 0', () => {
        render(
            <Wrapper>
                <TitleWithYearDropdown title="Testing Title" order={2} year={0} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        expect(screen.getByRole('button')).toHaveTextContent('All-time');
    });
});
