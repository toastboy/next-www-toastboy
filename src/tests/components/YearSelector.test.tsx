import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';

import { YearSelector } from '@/components/YearSelector/YearSelector';
import { Wrapper } from '@/tests/components/lib/common';

describe('YearSelector', () => {
    let push: jest.Mock;

    beforeEach(() => {
        push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push,
            replace: jest.fn(),
            back: jest.fn(),
            refresh: jest.fn(),
            prefetch: jest.fn(),
        });
        (usePathname as jest.Mock).mockReturnValue('/footy/year/2024');
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
