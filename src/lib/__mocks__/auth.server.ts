import { vi } from 'vitest';

export const MOCK_AUTH_COOKIE = 'mock-auth-state';
export const MOCK_AUTH_USER_COOKIE = 'mock-auth-user';

export const isMockAuthEnabled = vi.fn(() => true);
export const getMockAuthState = vi.fn();
export const getMockUser = vi.fn();
export const getMockUsersList = vi.fn();
export const getSession = vi.fn();
export const getCurrentUser = vi.fn();
export const getUserRole = vi.fn(async () => Promise.resolve('none'));
export const requireAdmin = vi.fn(async () => Promise.resolve());
export const requireUser = vi.fn(async () => Promise.resolve());
