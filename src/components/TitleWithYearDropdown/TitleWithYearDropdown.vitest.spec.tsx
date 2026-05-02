import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { vi } from 'vitest';

import { Wrapper } from '../../tests/components/lib/common';
import { TitleWithYearDropdown } from './TitleWithYearDropdown';

const mockParams = (init = '') =>
    new URLSearchParams(init) as unknown as ReturnType<typeof useSearchParams>;

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
        vi.mocked(useSearchParams).mockReturnValue(mockParams());
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

    const clickMenuItemByText = (label: string) => {
        const item = screen.getAllByRole('menuitem', { hidden: true }).find(
            el => el.textContent?.trim() === label,
        );
        expect(item).toBeDefined();
        fireEvent.click(item!);
    };

    it('navigates to year URL with year param when a year is selected', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <TitleWithYearDropdown title="Testing Title" order={2} year={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button'));
        clickMenuItemByText('2023');

        expect(push).toHaveBeenCalledWith('/footy/year/2024?year=2023');
    });

    it('navigates to URL without year param when All-time is selected', async () => {
        const user = userEvent.setup();
        vi.mocked(useSearchParams).mockReturnValue(mockParams('year=2024'));
        render(
            <Wrapper>
                <TitleWithYearDropdown title="Testing Title" order={2} year={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button'));
        clickMenuItemByText('All-time');

        expect(push).toHaveBeenCalledWith('/footy/year/2024');
    });

    it('preserves existing search params when changing year', async () => {
        const user = userEvent.setup();
        vi.mocked(useSearchParams).mockReturnValue(mockParams('tab=history'));
        render(
            <Wrapper>
                <TitleWithYearDropdown title="Testing Title" order={2} year={2024} validYears={[0, 2023, 2024]} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button'));
        clickMenuItemByText('2023');

        expect(push).toHaveBeenCalledWith('/footy/year/2024?tab=history&year=2023');
    });
});
