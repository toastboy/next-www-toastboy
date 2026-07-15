'use client';

import { AspectRatio, Image, type ImageProps, Skeleton } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Props extends Omit<ImageProps, 'onLoad' | 'onError' | 'src'> {
    /** Width / height ratio the space is reserved at, e.g. 1 for square, 3 / 2 for a flag. */
    ratio: number;
    alt: string;
    title?: string;
    /** Mantine types this as `any` for Next.js `StaticImageData` compatibility,
        but this component always renders a plain `<img>`, so a real API path
        is required here. */
    src: string;
    /** Called once the image has finished loading, or failed to. */
    onReady?: () => void;
}

/**
 * Wraps Mantine's Image in a fixed-ratio box so its footprint is reserved
 * before the src has loaded, and shows a Skeleton over it until then —
 * avoiding the layout shift a bare `Image` causes while its bytes are still
 * in flight. `w` sizes the reserved box itself (defaulting to the full width
 * of its container); the image inside always fills that box.
 */
export const ImageWithPlaceholder = ({ ratio, radius, w = '100%', alt, onReady, ...imageProps }: Props) => {
    const [loaded, setLoaded] = useState(false);

    // If this instance is reused for a different src (rather than remounted),
    // reset the skeleton for the new image's own loading lifecycle instead of
    // carrying over the previous image's "loaded" status.
    const [trackedSrc, setTrackedSrc] = useState(imageProps.src);
    if (imageProps.src !== trackedSrc) {
        setTrackedSrc(imageProps.src);
        setLoaded(false);
    }

    const onReadyRef = useRef(onReady);
    useEffect(() => {
        onReadyRef.current = onReady;
    }, [onReady]);

    // Guards against onReady firing twice for the same src — the mount-time
    // `.complete` check below and a subsequent `load`/`error` event can both
    // fire for a single image lifecycle.
    const readySrcRef = useRef<string | undefined>(undefined);
    const handleReady = useCallback(() => {
        setLoaded(true);
        if (readySrcRef.current !== imageProps.src) {
            readySrcRef.current = imageProps.src;
            onReadyRef.current?.();
        }
    }, [imageProps.src]);

    // <img onLoad> never fires if the browser has already resolved the image
    // (e.g. served from cache) by the time React attaches the listener — a
    // well-known race that's especially likely on a fast local dev server.
    // A stable ref callback runs exactly once, right as the node mounts, so
    // check `.complete` there rather than waiting for an event that may have
    // already happened.
    const imgRef = useCallback((node: HTMLImageElement | null) => {
        if (node?.complete) handleReady();
    }, [handleReady]);

    return (
        <AspectRatio ratio={ratio} w={w} pos="relative">
            <Skeleton
                visible={!loaded}
                radius={radius}
                pos="absolute"
                inset={0}
                aria-hidden="true"
            />
            <Image
                {...imageProps}
                ref={imgRef}
                alt={alt}
                radius={radius}
                onLoad={handleReady}
                onError={handleReady}
                style={{ opacity: loaded ? 1 : 0, transition: 'opacity 150ms ease' }}
            />
        </AspectRatio>
    );
};
