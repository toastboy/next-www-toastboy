import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { PieChart } from '@/components/PieChart/PieChart';
import { Wrapper } from '@/tests/components/lib/common';

const data = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 70 },
];

class ImmediateResizeObserver {
    private callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe(_target: Element) {
        const entry = { contentRect: { width: 400, height: 400 } };
        this.callback([entry as unknown as ResizeObserverEntry], this);
    }
    unobserve() { /* empty */ }
    disconnect() { /* empty */ }
}

describe('PieChart', () => {
    beforeEach(() => {
        vi.stubGlobal('ResizeObserver', ImmediateResizeObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders one slice path per data item', () => {
        const { container } = render(
            <Wrapper>
                <PieChart data={data} />
            </Wrapper>,
        );

        expect(container.querySelectorAll('svg path')).toHaveLength(data.length);
    });

    it('renders a label for each data item', () => {
        const { container } = render(
            <Wrapper>
                <PieChart data={data} />
            </Wrapper>,
        );

        const labels = Array.from(container.querySelectorAll('svg text')).map(el => el.textContent);
        expect(labels).toContain('Category A');
        expect(labels).toContain('Category B');
    });

    it('does not throw when ResizeObserver fires after the component unmounts', () => {
        let capturedCallback: ResizeObserverCallback | undefined;

        class ControlledResizeObserver {
            constructor(cb: ResizeObserverCallback) { capturedCallback = cb; }
            observe() { /* empty */ }
            unobserve() { /* empty */ }
            disconnect() { /* empty */ }
        }
        vi.stubGlobal('ResizeObserver', ControlledResizeObserver);

        try {
            const { unmount } = render(
                <Wrapper>
                    <PieChart data={data} />
                </Wrapper>,
            );

            expect(capturedCallback).toBeDefined();
            unmount(); // clears wrapperRef.current and svgRef.current

            const entry = { contentRect: { width: 400, height: 400 } } as unknown as ResizeObserverEntry;
            expect(() => capturedCallback!([entry], {} as ResizeObserver)).not.toThrow();
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('skips draw when ResizeObserver fires with empty entries', () => {
        class EmptyEntriesObserver {
            private callback: ResizeObserverCallback;
            constructor(callback: ResizeObserverCallback) { this.callback = callback; }
            observe() {
                this.callback([], this);
            }
            unobserve() { /* empty */ }
            disconnect() { /* empty */ }
        }
        vi.stubGlobal('ResizeObserver', EmptyEntriesObserver);

        try {
            const { container } = render(
                <Wrapper>
                    <PieChart data={data} />
                </Wrapper>,
            );

            // No slices drawn when entries are empty
            expect(container.querySelectorAll('svg path')).toHaveLength(0);
        } finally {
            vi.unstubAllGlobals();
        }
    });
});
