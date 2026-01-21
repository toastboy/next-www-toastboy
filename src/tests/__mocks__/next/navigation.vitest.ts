import { vi } from 'vitest';

const defaultRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
};

export const useRouter = vi.fn(() => defaultRouter);

export const usePathname = vi.fn(() => '/');

export const useSearchParams = vi.fn(() => new URLSearchParams());

export const redirect = vi.fn();

export const permanentRedirect = vi.fn();

export const notFound = vi.fn();
