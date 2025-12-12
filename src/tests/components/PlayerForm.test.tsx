jest.mock('components/GameDayLink/GameDayLink', () => {
    const MockGameDayLink = () => <div data-testid="mock-gameday-link" />;
    MockGameDayLink.displayName = 'MockGameDayLink';
    return MockGameDayLink;
});

import { render, screen } from '@testing-library/react';

import PlayerForm from '@/components/PlayerForm/PlayerForm';
import { defaultPlayerFormList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerForm', () => {
    it('renders progress bar with game links', () => {
        render(
            <Wrapper>
                <PlayerForm form={defaultPlayerFormList} />
            </Wrapper>,
        );

        const gameLinks = screen.getAllByTestId('mock-gameday-link');
        expect(gameLinks.length).toBe(defaultPlayerFormList.length);
    });
});
