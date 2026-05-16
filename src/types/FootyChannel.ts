/**
 * Named channels for the server-sent events pub/sub system.
 * Add new channel names here as features require live updates.
 */
export const FootyChannel = {
    Games: 'games',
    Invitations: 'invitations',
    Money: 'money',
    Players: 'players',
    Responses: 'responses',
    Results: 'results',
} as const;

export type FootyChannel = typeof FootyChannel[keyof typeof FootyChannel];
