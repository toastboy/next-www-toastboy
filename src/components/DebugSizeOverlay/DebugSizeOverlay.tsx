'use client';

import { Badge, Box } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { CSSProperties, ReactNode } from 'react';

/**
 * DebugSizeOverlay
 *
 * Wraps any container and shows a live badge with its current
 * width/height in both px and em (based on the root font-size),
 * so you can eyeball breakpoint behaviour while resizing.
 *
 * Usage:
 *   <DebugSizeOverlay>
 *     <YourLayout />
 *   </DebugSizeOverlay>
 *
 * Remove or wrap in `process.env.NODE_ENV === 'development'`
 * before shipping to production.
 */

interface DebugSizeOverlayProps {
    children: ReactNode;
    /** root font-size in px used to convert to em, defaults to 16 */
    rootFontSize?: number;
    /** corner to pin the badge to */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    style?: CSSProperties;
}

const positionStyles: Record<NonNullable<DebugSizeOverlayProps['position']>, CSSProperties> = {
    'top-left': { top: 4, left: 4 },
    'top-right': { top: 4, right: 4 },
    'bottom-left': { bottom: 4, left: 4 },
    'bottom-right': { bottom: 4, right: 4 },
};

export function DebugSizeOverlay({
    children,
    rootFontSize = 16,
    position = 'top-right',
    style,
}: DebugSizeOverlayProps) {
    const { ref, width, height } = useElementSize();

    const widthEm = (width / rootFontSize).toFixed(2);
    const heightEm = (height / rootFontSize).toFixed(2);

    return (
        <Box ref={ref} pos="relative" style={{ ...style }}>
            <Badge
                variant="filled"
                color="dark"
                radius="sm"
                style={{
                    position: 'absolute',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    fontFamily: 'monospace',
                    ...positionStyles[position],
                }}
            >
                {Math.round(width)}px × {Math.round(height)}px ({widthEm}em × {heightEm}em)
            </Badge>
            {children}
        </Box>
    );
}
