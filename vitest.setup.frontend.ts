import '@testing-library/jest-dom/vitest';

const mockMatchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
});

if (!('matchMedia' in globalThis)) {
    Object.defineProperty(globalThis, 'matchMedia', { value: mockMatchMedia, writable: true });
}

if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = mockMatchMedia;
}

if (!('ResizeObserver' in globalThis)) {
    class MockResizeObserver {
        observe() { /* empty */ }
        unobserve() { /* empty */ }
        disconnect() { /* empty */ }
    }

    Object.defineProperty(globalThis, 'ResizeObserver', {
        value: MockResizeObserver,
        writable: true,
    });
}
