const push = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
    usePathname: () => '/footy/year/2024',
}));

import { fireEvent, render, screen } from '@testing-library/react';

import { YearSelector } from '@/components/YearSelector/YearSelector';
import { Wrapper } from '@/tests/components/lib/common';

describe('YearSelector', () => {
    beforeEach(() => {
        push.mockClear();
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
