jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';
import { Wrapper, loaderClass } from "./lib/common";

describe('PlayerMugshot', () => {
    // TODO: Move test data to a common file
    const player = {
        id: 1,
        login: 'john_doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        born: new Date('1990-01-01'),
        isAdmin: null,
        firstName: "John",
        lastName: "Doe",
        anonymous: false,
        joined: null,
        finished: null,
        comment: null,
        introducedBy: null,
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders with data', async () => {
        const { container } = render(<Wrapper><PlayerMugshot player={player} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByAltText("John Doe")).toHaveAttribute("src", "/api/footy/player/john_doe/mugshot");
        });
    });
});
