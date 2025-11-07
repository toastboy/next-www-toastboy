jest.mock('services/GameDay', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

import { render, screen } from '@testing-library/react';
import GameDayLink, { Props } from 'components/GameDayLink/GameDayLink';
import gameDayService from 'services/GameDay';
import { Wrapper } from './lib/common';

describe('GameDayLink', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders link with Swedish-locale date when gameDay exists', async () => {
        (gameDayService.get as jest.Mock).mockResolvedValueOnce({
            id: 123,
            date: '2021-03-05T18:00:00.000Z',
        });

        // Resolve async server component into JSX, then render.
        const element = await GameDayLink({ gameDayId: 123 } as Props);
        render(<Wrapper>{element}</Wrapper>);

        const link = screen.getByRole('link', { name: /2021-03-05/ });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/footy/game/123');
        expect(gameDayService.get).toHaveBeenCalledWith(123);
    });

    it('renders nothing when gameDay does not exist', async () => {
        (gameDayService.get as jest.Mock).mockResolvedValueOnce(null);

        const element = await GameDayLink({ gameDayId: 9999 } as Props);
        const { container } = render(<Wrapper>{element}</Wrapper>);

        expect(container.querySelector('a')).toBeNull();
        expect(gameDayService.get).toHaveBeenCalledWith(9999);
    });
});
