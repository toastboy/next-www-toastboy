/** @jest-environment node */

jest.mock('components/GameDayLink/GameDayLink');

import PlayerLastPlayed from 'components/PlayerLastPlayed/PlayerLastPlayed';
import { defaultGameDay } from 'mocks/data/gameday';
import { defaultOutcome } from 'mocks/data/outcome';
import { defaultPlayer } from 'mocks/data/player';
import { renderToString } from 'react-dom/server';
import playerService from 'services/Player';
import { Wrapper } from './lib/common';

describe('PlayerLastPlayed', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders a GameDayLink component with the correct text', async () => {
        jest.spyOn(playerService, 'getLastPlayed').mockImplementation(() => Promise.resolve(
            {
                ...defaultOutcome,
                gameDay: defaultGameDay,
            },
        ));

        const component = await PlayerLastPlayed({ player: defaultPlayer });
        const renderedHtml = renderToString(<Wrapper>{component}</Wrapper>);

        // TODO: This is clunky but the output can contain escapes etc. which it
        // seems hard to account for
        expect(renderedHtml).toContain(`Last played:`);
        expect(renderedHtml).toContain(`GameDayLink (id:`);
        expect(renderedHtml).toContain(`${defaultGameDay.id}`);
    });

    it('renders nothing if lastPlayed is null', async () => {
        jest.spyOn(playerService, 'getLastPlayed').mockImplementation(() => Promise.resolve(null));

        const component = await PlayerLastPlayed({ player: defaultPlayer });
        const renderedHtml = renderToString(<Wrapper>{component}</Wrapper>);

        expect(renderedHtml).not.toContain(`Last played:`);
    });
});
