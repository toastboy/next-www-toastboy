import { render, screen } from '@testing-library/react';

import { PlayerHistory } from '@/components/PlayerHistory/PlayerHistory';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecord } from '@/tests/mocks';

jest.mock('components/YearSelector/YearSelector');
jest.mock('components/PlayerResults/PlayerResults');
jest.mock('components/PlayerPositions/PlayerPositions');

describe('PlayerHistory', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders year selector and child components with active years', async () => {
        render(
            <Wrapper>
                <PlayerHistory
                    playerName={'Lionel Scruffy'}
                    activeYears={[2020, 2021, 2022, 2023]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        await screen.findByText(/YearSelector/);

        expect(
            screen.getByText(/YearSelector:.*"activeYear":2023.*"validYears":\[2020,2021,2022,2023\]/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerResults:.*"playerName":"Lionel Scruffy".*"year":2023/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerPositions:.*"playerName":"Lionel Scruffy".*"year":2023/s),
        ).toBeInTheDocument();
    });

    it('handles no active years', async () => {
        render(
            <Wrapper>
                <PlayerHistory
                    playerName={'Lionel Scruffy'}
                    activeYears={[]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        await screen.findByText(/YearSelector/);

        expect(
            screen.getByText(/YearSelector:.*"activeYear":2023.*"validYears":\[\]/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerResults:.*"playerName":"Lionel Scruffy".*"year":2023/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerPositions:.*"playerName":"Lionel Scruffy".*"year":2023/s),
        ).toBeInTheDocument();
    });
});
