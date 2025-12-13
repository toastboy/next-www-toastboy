jest.mock('@/components/GameDayLink/GameDayLink');

import { render, screen } from '@testing-library/react';

import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerFormList } from '@/tests/mocks';

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
