// @vitest-environment happy-dom
import { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

vi.mock('next/error', () => ({
    default: () => null,
}));

import GlobalError from '@/app/global-error';

describe('GlobalError', () => {
    let container: HTMLDivElement;
    let root: Root | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container.remove();
    });

    it('captures the error with client layer context on mount', () => {
        const error = new Error('catastrophic failure') as Error & { digest?: string };

        act(() => {
            root = createRoot(container);
            root.render(<GlobalError error={error} />);
        });

        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(error, {
            layer: 'client',
            component: 'GlobalError',
            route: '/app/global-error',
        });
    });
});
