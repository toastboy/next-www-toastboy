import { render, screen, waitFor } from '@testing-library/react';
import TeamPlayer from 'components/TeamPlayer';
import { Wrapper, loaderClass } from "./lib/common";

const idOrLogin = "dturnipson";

jest.mock('components/PlayerLink', () => {
    const PlayerLink = ({ idOrLogin }: { idOrLogin: string }) => (
        <div>PlayerLink (idOrLogin: {idOrLogin})</div>
    );
    PlayerLink.displayName = 'PlayerLink';
    return PlayerLink;
});
jest.mock('components/PlayerMugshot', () => {
    const PlayerMugshot = ({ idOrLogin }: { idOrLogin: string }) => (
        <div>PlayerMugshot (idOrLogin: {idOrLogin})</div>
    );
    PlayerMugshot.displayName = 'PlayerMugshot';
    return PlayerMugshot;
});
jest.mock('components/PlayerForm', () => {
    const PlayerForm = ({ idOrLogin, games }: { idOrLogin: string, games: number }) => (
        <div>PlayerForm (idOrLogin: {idOrLogin} games: {games})</div>
    );
    PlayerForm.displayName = 'PlayerForm';
    return PlayerForm;
});

describe('TeamPlayer', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders with data', async () => {
        const { container } = render(<Wrapper><TeamPlayer idOrLogin={idOrLogin} goalie={false} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText('PlayerLink (idOrLogin: dturnipson)')).toBeInTheDocument();
            expect(screen.getByText('PlayerMugshot (idOrLogin: dturnipson)')).toBeInTheDocument();
            expect(screen.getByText('PlayerForm (idOrLogin: dturnipson games: 10)')).toBeInTheDocument();
        });
    });

    it('renders with data + goalie', async () => {
        const { container } = render(<Wrapper><TeamPlayer idOrLogin={idOrLogin} goalie={true} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText('GOALIE!')).toBeInTheDocument();
        });
    });
});
