const defaultRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
};

export const useRouter = jest.fn(() => defaultRouter);

export const usePathname = jest.fn(() => '/');

export const useSearchParams = jest.fn(() => new URLSearchParams());

export const redirect = jest.fn();

export const permanentRedirect = jest.fn();

export const notFound = jest.fn();
