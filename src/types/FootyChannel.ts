/**
 * Named channels for the server-sent events pub/sub system.
 * Add new channel names here as features require live updates.
 */
export type FootyChannel =
    | 'games'
    | 'invitations'
    | 'players'
    | 'responses'
    | 'results';
