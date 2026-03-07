import { vi } from 'vitest';

vi.mock('next/navigation');

describe('Game Invitation Response page', () => {
    it.todo('redirects to /footy/game when neither token nor error is present');
    it.todo('renders an error message when an error param is present');
    it.todo('renders a missing-details message when playerId, playerName, or gameDayId is absent');
    it.todo('renders GameInvitationResponseForm with correct details when all params are valid');
    it.todo('parses goalie param: "true" -> true, anything else -> false');
    it.todo('coerces playerId and gameDayId to numbers');
});
