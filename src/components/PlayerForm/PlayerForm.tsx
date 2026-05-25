import { Tooltip } from '@mantine/core';

import { formatDate } from '@/lib/dates';
import { PlayerFormType } from '@/types';

export interface Props {
    form: PlayerFormType[];
}

const TOTAL_ARC = 280;
const RING_RADIUS = 57;
const STROKE_WIDTH = 6;
// Fixed gap in arc-degrees per segment boundary. Rounded linecaps extend the
// visual stroke by ~3° per end at this radius/strokeWidth, so 10° leaves ~4°
// of visible gap between dashes regardless of item count.
const GAP_DEG = 10;
const CX = 50;
const CY = 50;

const colorMap = new Map<number | null | undefined, string>([
    [null, 'var(--mantine-color-gray-5)'],
    [undefined, 'var(--mantine-color-gray-5)'],
    [0, 'var(--mantine-color-red-6)'],
    [1, 'var(--mantine-color-yellow-5)'],
    [3, 'var(--mantine-color-green-6)'],
]);

const resultLabel = new Map<number | null | undefined, string>([
    [null, 'Did not play'],
    [undefined, 'Did not play'],
    [0, 'Lost'],
    [1, 'Draw'],
    [3, 'Won'],
]);

function arcPoint(clockDeg: number, r: number): { x: number; y: number } {
    const rad = (clockDeg * Math.PI) / 180;
    return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) };
}

function buildArcPath(clockStart: number, clockEnd: number, r: number): string {
    const { x: x1, y: y1 } = arcPoint(clockStart, r);
    const { x: x2, y: y2 } = arcPoint(clockEnd, r);
    const largeArc = clockEnd - clockStart > 180 ? 1 : 0;
    return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
}

export const PlayerForm = ({ form }: Props) => {
    if (form.length === 0) return null;

    const n = form.length;
    const segmentDeg = TOTAL_ARC / n;
    const dashDeg = Math.max(segmentDeg - GAP_DEG, 1);
    const arcStart = -TOTAL_ARC / 2;

    return (
        <svg
            viewBox="0 0 100 100"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'visible',
                pointerEvents: 'none',
            }}
        >
            {form.map((data, i) => {
                const segStart = arcStart + i * segmentDeg + GAP_DEG / 2;
                const segEnd = segStart + dashDeg;
                const color = colorMap.get(data.points) ?? 'var(--mantine-color-gray-5)';
                const d = buildArcPath(segStart, segEnd, RING_RADIUS);

                // Padding entry: no associated game day, just a grey placeholder.
                if (!data.gameDay) {
                    return (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            stroke={color}
                            strokeWidth={STROKE_WIDTH}
                            strokeLinecap="round"
                        />
                    );
                }

                const href = `/footy/game/${data.gameDay.id}`;
                const label = `${formatDate(data.gameDay.date)} – ${resultLabel.get(data.points) ?? ''}`;

                return (
                    <a
                        key={i}
                        href={href}
                        aria-label={label}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <Tooltip label={label} withinPortal>
                            <path
                                d={d}
                                fill="none"
                                stroke={color}
                                strokeWidth={STROKE_WIDTH}
                                strokeLinecap="round"
                                style={{ cursor: 'pointer' }}
                            />
                        </Tooltip>
                    </a>
                );
            })}
        </svg>
    );
};
