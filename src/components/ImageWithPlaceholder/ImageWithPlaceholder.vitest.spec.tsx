import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, type MockInstance, vi } from 'vitest';

import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder';
import { Wrapper } from '@/tests/components/lib/common';

describe('ImageWithPlaceholder', () => {
    // jsdom doesn't implement real image loading, so `.complete` defaults to
    // true for every <img> regardless of whether it has actually "loaded" —
    // stub it to false so these tests can simulate the normal still-loading
    // starting state, same as a real browser with a request in flight.
    let completeSpy: MockInstance<() => boolean>;

    beforeEach(() => {
        completeSpy = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(false);
    });

    afterEach(() => {
        completeSpy.mockRestore();
    });

    it('renders the image with the given src, alt and title', () => {
        render(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/example.png" alt="Example" title="Example" />
            </Wrapper>,
        );

        const img = screen.getByRole('img', { name: 'Example' });
        expect(img).toHaveAttribute('src', '/example.png');
        expect(img).toHaveAttribute('title', 'Example');
    });

    it('hides the skeleton once the image has loaded', () => {
        render(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/example.png" alt="Example" />
            </Wrapper>,
        );

        const img = screen.getByRole('img', { name: 'Example' });
        expect(img).toHaveStyle({ opacity: '0' });

        fireEvent.load(img);

        expect(img).toHaveStyle({ opacity: '1' });
    });

    it('hides the skeleton if the image fails to load', () => {
        render(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/broken.png" alt="Example" />
            </Wrapper>,
        );

        const img = screen.getByRole('img', { name: 'Example' });
        fireEvent.error(img);

        expect(img).toHaveStyle({ opacity: '1' });
    });

    it('calls onReady once the image has loaded', () => {
        const onReady = vi.fn();
        render(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/example.png" alt="Example" onReady={onReady} />
            </Wrapper>,
        );

        fireEvent.load(screen.getByRole('img', { name: 'Example' }));

        expect(onReady).toHaveBeenCalledOnce();
    });

    it('calls onReady if the image fails to load', () => {
        const onReady = vi.fn();
        render(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/broken.png" alt="Example" onReady={onReady} />
            </Wrapper>,
        );

        fireEvent.error(screen.getByRole('img', { name: 'Example' }));

        expect(onReady).toHaveBeenCalledOnce();
    });

    it('resets the skeleton and re-fires onReady when the src changes on a reused instance', () => {
        const onReady = vi.fn();
        const { rerender } = render(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/example.png" alt="Example" onReady={onReady} />
            </Wrapper>,
        );

        fireEvent.load(screen.getByRole('img', { name: 'Example' }));
        expect(screen.getByRole('img', { name: 'Example' })).toHaveStyle({ opacity: '1' });
        expect(onReady).toHaveBeenCalledOnce();

        rerender(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/other.png" alt="Example" onReady={onReady} />
            </Wrapper>,
        );

        const img = screen.getByRole('img', { name: 'Example' });
        expect(img).toHaveAttribute('src', '/other.png');
        expect(img).toHaveStyle({ opacity: '0' });

        fireEvent.load(img);

        expect(img).toHaveStyle({ opacity: '1' });
        expect(onReady).toHaveBeenCalledTimes(2);
    });

    it('reveals immediately if the browser already resolved the image before mount (e.g. cache hit)', () => {
        // Simulates the race where the browser serves the image from cache so
        // fast that `.complete` is already true by the time React attaches
        // the node — no `load` event ever fires in that case.
        completeSpy.mockReturnValue(true);
        const onReady = vi.fn();

        render(
            <Wrapper>
                <ImageWithPlaceholder ratio={1} src="/example.png" alt="Example" onReady={onReady} />
            </Wrapper>,
        );

        expect(screen.getByRole('img', { name: 'Example' })).toHaveStyle({ opacity: '1' });
        expect(onReady).toHaveBeenCalledOnce();
    });
});
