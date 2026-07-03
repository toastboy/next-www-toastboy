import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    Container: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/actions/triggerInvitations', () => ({
    triggerInvitations: vi.fn(),
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: vi.fn(() => null),
}));

vi.mock('@/components/NewGameForm/NewGameForm', () => ({
    NewGameForm: vi.fn(() => null),
}));

import { triggerInvitations } from '@/actions/triggerInvitations';
import NewGamePage from '@/app/footy/admin/newgame/page';
import { NewGameForm } from '@/components/NewGameForm/NewGameForm';

describe('New Game page', () => {
    it('renders the NewGameForm with the triggerInvitations server action', () => {
        renderToStaticMarkup(NewGamePage());

        expect(NewGameForm).toHaveBeenCalledWith(
            { onTriggerInvitations: triggerInvitations },
            undefined,
        );
    });
});
