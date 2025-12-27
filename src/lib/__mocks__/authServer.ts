export const MOCK_AUTH_COOKIE = 'mock-auth-state';

export const getMockAuthState = jest.fn();
export const getMockUser = jest.fn();
export const getMockUsersList = jest.fn();
export const getSession = jest.fn();
export const getCurrentUser = jest.fn();
export const getUserRole = jest.fn(async () => Promise.resolve('none'));
