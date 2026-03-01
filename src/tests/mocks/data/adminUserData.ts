import type { UserWithRolePayload } from '@/lib/actions/auth';

export const defaultAdminUserDataPayload: UserWithRolePayload = {
    id: 'user_1',
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2024-06-20T12:00:00.000Z',
    email: 'gary.player@example.com',
    emailVerified: true,
    name: 'Gary Player',
    image: null,
    role: 'admin',
    banned: false,
    banReason: null,
    banExpires: null,
};
