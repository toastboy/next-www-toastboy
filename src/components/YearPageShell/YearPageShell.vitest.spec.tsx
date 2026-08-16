import { render, screen } from '@testing-library/react';

import { YearPageShell } from '@/components/YearPageShell/YearPageShell';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { FootyChannel } from '@/types/FootyChannel';

vi.mock('@/components/AutoRefresh/AutoRefresh');
vi.mock('@/components/TitleWithYearDropdown/TitleWithYearDropdown');

describe('YearPageShell', () => {
    it('renders its children', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Books: "
                    year={2024}
                    validYears={[2023, 2024]}
                >
                    <div>Body content</div>
                </YearPageShell>
            </Wrapper>,
        );

        expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('passes title, year, and validYears through to TitleWithYearDropdown', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Winners: "
                    year={2024}
                    validYears={[2023, 2024]}
                >
                    <div>Body</div>
                </YearPageShell>
            </Wrapper>,
        );

        const [props] = extractMockProps<{
            title: string;
            year: number;
            validYears: number[];
        }>('TitleWithYearDropdown');
        expect(props.title).toBe('Winners: ');
        expect(props.year).toBe(2024);
        expect(props.validYears).toEqual([2023, 2024]);
    });

    it('does not render AutoRefresh when autoRefreshChannels is omitted', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Books: "
                    year={2024}
                    validYears={[2024]}
                >
                    <div>Body</div>
                </YearPageShell>
            </Wrapper>,
        );

        expect(screen.queryByText(/AutoRefresh/)).not.toBeInTheDocument();
    });

    it('renders AutoRefresh with the given channels when provided', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Games: "
                    year={2024}
                    validYears={[2024]}
                    autoRefreshChannels={[
                        FootyChannel.Games,
                        FootyChannel.Results,
                    ]}
                >
                    <div>Body</div>
                </YearPageShell>
            </Wrapper>,
        );

        const [props] = extractMockProps<{ channels: unknown }>('AutoRefresh');
        expect(props.channels).toEqual([
            FootyChannel.Games,
            FootyChannel.Results,
        ]);
    });

    it('renders the subheading when provided', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Games: "
                    year={2024}
                    validYears={[2024]}
                    subheading="5 played, 1 cancelled"
                >
                    <div>Body</div>
                </YearPageShell>
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { name: '5 played, 1 cancelled' }),
        ).toBeInTheDocument();
    });

    it('omits the subheading when not provided', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Books: "
                    year={2024}
                    validYears={[2024]}
                >
                    <div>Body</div>
                </YearPageShell>
            </Wrapper>,
        );

        expect(screen.queryAllByRole('heading')).toHaveLength(0);
    });

    it('omits the subheading when it is an empty string', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Games: "
                    year={2024}
                    validYears={[2024]}
                    subheading=""
                >
                    <div>Body</div>
                </YearPageShell>
            </Wrapper>,
        );

        expect(screen.queryAllByRole('heading')).toHaveLength(0);
    });

    it('omits the subheading when it is whitespace-only', () => {
        render(
            <Wrapper>
                <YearPageShell
                    title="Games: "
                    year={2024}
                    validYears={[2024]}
                    subheading="   "
                >
                    <div>Body</div>
                </YearPageShell>
            </Wrapper>,
        );

        expect(screen.queryAllByRole('heading')).toHaveLength(0);
    });
});
