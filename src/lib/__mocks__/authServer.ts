import { vi } from 'vitest';

export const MOCK_AUTH_COOKIE = 'mock-auth-state';

export const getMockAuthState = vi.fn();
export const getMockUser = vi.fn();
export const getMockUsersList = vi.fn();
export const getSession = vi.fn();
export const getCurrentUser = vi.fn();
export const getUserRole = vi.fn(async () => Promise.resolve('none'));
