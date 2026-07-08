import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerInfo } from '@/components/PlayerInfo/PlayerInfo';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockPlayer, defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerEmailData } from '@/tests/mocks/data/playerData';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';

vi.mock('@/components/EmailPlayerButton/EmailPlayerButton');
vi.mock('@/components/GameDayLink/GameDayLink');
vi.mock('@/components/PlayerLink/PlayerLink');

describe('PlayerInfo', () => {
    const baseProps = {
        player: defaultPlayer,
        year: 2024,
        introducedBy: null,
        lastPlayed: null,
        lastWon: null,
    };

    describe('email row', () => {
        const onSendEmail = vi.fn();

        it('shows when isAdmin, playerData, and onSendEmail are all provided', () => {
            render(<Wrapper><PlayerInfo {...baseProps} isAdmin={true} playerData={defaultPlayerEmailData} onSendEmail={onSendEmail} /></Wrapper>);
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText(/EmailPlayerButton:/)).toBeInTheDocument();
        });

        it('is hidden when isAdmin is false', () => {
            render(<Wrapper><PlayerInfo {...baseProps} isAdmin={false} playerData={defaultPlayerEmailData} onSendEmail={onSendEmail} /></Wrapper>);
            expect(screen.queryByText('Email')).not.toBeInTheDocument();
        });

        it('is hidden when playerData is not provided', () => {
            render(<Wrapper><PlayerInfo {...baseProps} isAdmin={true} onSendEmail={onSendEmail} /></Wrapper>);
            expect(screen.queryByText('Email')).not.toBeInTheDocument();
        });

        it('is hidden when onSendEmail is not provided', () => {
            render(<Wrapper><PlayerInfo {...baseProps} isAdmin={true} playerData={defaultPlayerEmailData} /></Wrapper>);
            expect(screen.queryByText('Email')).not.toBeInTheDocument();
        });

        it('is hidden by default', () => {
            render(<Wrapper><PlayerInfo {...baseProps} /></Wrapper>);
            expect(screen.queryByText('Email')).not.toBeInTheDocument();
        });
    });

    describe('born row', () => {
        it('shows when isAuthenticated is true', () => {
            render(<Wrapper><PlayerInfo {...baseProps} isAuthenticated={true} /></Wrapper>);
            expect(screen.getByText('Born')).toBeInTheDocument();
        });

        it('is hidden when isAuthenticated is false', () => {
            render(<Wrapper><PlayerInfo {...baseProps} isAuthenticated={false} /></Wrapper>);
            expect(screen.queryByText('Born')).not.toBeInTheDocument();
        });
    });

    describe('introducedBy row', () => {
        it('shows when introducedBy is provided', () => {
            const introducer = createMockPlayer({ id: 2, name: 'Introducer' });
            render(<Wrapper><PlayerInfo {...baseProps} introducedBy={introducer} /></Wrapper>);
            expect(screen.getByText('Introduced by')).toBeInTheDocument();
            expect(screen.getByText((content) =>
                content.startsWith('PlayerLink:') && content.includes('"name":"Introducer"'),
            )).toBeInTheDocument();
        });

        it('is hidden when introducedBy is null', () => {
            render(<Wrapper><PlayerInfo {...baseProps} introducedBy={null} /></Wrapper>);
            expect(screen.queryByText('Introduced by')).not.toBeInTheDocument();
        });
    });

    describe('last played row', () => {
        it('is always present regardless of lastPlayed value', () => {
            render(<Wrapper><PlayerInfo {...baseProps} lastPlayed={null} /></Wrapper>);
            expect(screen.getByText('Last played')).toBeInTheDocument();
        });

        it('passes the game day through to GameDayLink when lastPlayed is provided', () => {
            render(<Wrapper><PlayerInfo {...baseProps} lastPlayed={defaultPlayerFormList[0]} /></Wrapper>);
            expect(screen.getByText((content) =>
                content.startsWith('GameDayLink:') && content.includes('"gameDay"'),
            )).toBeInTheDocument();
        });
    });

    describe('last won row', () => {
        it('is always present regardless of lastWon value', () => {
            render(<Wrapper><PlayerInfo {...baseProps} lastWon={null} /></Wrapper>);
            expect(screen.getByText('Last won')).toBeInTheDocument();
        });

        it('passes the game day through to GameDayLink when lastWon is provided', () => {
            render(<Wrapper><PlayerInfo {...baseProps} lastWon={defaultPlayerFormList[0]} /></Wrapper>);
            expect(screen.getByText((content) =>
                content.startsWith('GameDayLink:') && content.includes('"gameDay"'),
            )).toBeInTheDocument();
        });
    });

    describe('joined row', () => {
        it('shows the formatted join date when player.joined is set', () => {
            render(<Wrapper><PlayerInfo {...baseProps} /></Wrapper>);
            expect(screen.getByText('Joined')).toBeInTheDocument();
            expect(screen.getByText('2021-01-01')).toBeInTheDocument();
        });

        it('shows "N/A" when player.joined is null', () => {
            const playerNoJoined = createMockPlayer({ joined: null });
            render(<Wrapper><PlayerInfo {...baseProps} player={playerNoJoined} /></Wrapper>);
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });
    });
});
