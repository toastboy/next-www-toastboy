export type AuthRole = 'none' | 'user' | 'admin';

export interface AuthUserSummary {
    name: string | null;
    email: string | null;
    playerId: number;
    role: AuthRole;
}
