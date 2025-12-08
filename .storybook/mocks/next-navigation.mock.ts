import { useCallback } from 'react';

/**
 * Mock implementation of next/navigation hooks for Storybook
 * Provides stubs for useRouter and usePathname to prevent
 * "Tried to access router mocks from 'next/navigation'" errors
 */

export const useRouter = () => ({
    push: useCallback((path: string) => {
        console.log('[Storybook Router Mock] push:', path);
    }, []),
    replace: useCallback((path: string) => {
        console.log('[Storybook Router Mock] replace:', path);
    }, []),
    refresh: useCallback(() => {
        console.log('[Storybook Router Mock] refresh');
    }, []),
    back: useCallback(() => {
        console.log('[Storybook Router Mock] back');
    }, []),
    forward: useCallback(() => {
        console.log('[Storybook Router Mock] forward');
    }, []),
    prefetch: useCallback(async () => { }, []),
});

export const usePathname = () => '/footy';

export const useSearchParams = () => new URLSearchParams();

export const useParams = () => ({});
