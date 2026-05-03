import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerCountryMap } from '@/components/PlayerCountryMap/PlayerCountryMap';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultCountrySupporterWithPlayerDataList } from '@/tests/mocks/data/countrySupporterWithPlayerData';

const originalFetch = global.fetch;

const makeTopologyResponse = (topology: object) =>
    new Response(JSON.stringify(topology), {
        headers: { 'Content-Type': 'application/json' },
    });

const emptyTopology = {
    type: 'Topology',
    objects: { countries: { type: 'GeometryCollection', geometries: [] } },
    arcs: [],
};

// Minimal TopoJSON with a single United Kingdom polygon.
// England, Northern Ireland, Scotland, and Wales all map to this atlas name,
// so hovering it should show all four supporter groups in the popover.
const ukTopology = {
    type: 'Topology',
    objects: {
        countries: {
            type: 'GeometryCollection',
            geometries: [{
                type: 'Polygon',
                arcs: [[0]],
                properties: { name: 'United Kingdom' },
            }],
        },
    },
    // Non-quantised arc (no transform): coordinates are absolute lon/lat
    arcs: [[[-5, 50], [1, 50], [1, 59], [-5, 59]]],
};

describe('PlayerCountryMap', () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(emptyTopology));
    });

    afterEach(() => {
        global.fetch = originalFetch;
        vi.useRealTimers();
    });

    it('renders svg element', () => {
        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
        const { getByTestId } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        expect(getByTestId('player-country-map')).toBeInTheDocument();
    });

    it('renders with custom dimensions', () => {
        const { container } = render(
            <Wrapper>
                <PlayerCountryMap
                    countries={defaultCountrySupporterWithPlayerDataList}
                    width={640}
                    height={400}
                />
            </Wrapper>,
        );

        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '640');
        expect(svg).toHaveAttribute('height', '400');
    });

    it('renders with empty countries list', () => {
        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={[]} />
            </Wrapper>,
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('highlights supporter countries in blue and leaves others grey', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(ukTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        expect(container.querySelector('svg path')).toHaveAttribute('fill', '#228be6');
    });

    it('shows popover with all UK home nations grouped under one atlas entry', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(ukTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        fireEvent.mouseEnter(container.querySelector('svg path')!);

        // All four home nations appear as group headers in the popover
        await waitFor(() => expect(screen.getByText('England')).toBeInTheDocument());
        expect(screen.getByText('Northern Ireland')).toBeInTheDocument();
        expect(screen.getByText('Scotland')).toBeInTheDocument();
        expect(screen.getByText('Wales')).toBeInTheDocument();

        // Each player is listed under their respective group
        expect(screen.getByText('Player 1')).toBeInTheDocument();
        expect(screen.getByText('Player 2')).toBeInTheDocument();
        expect(screen.getByText('Player 3')).toBeInTheDocument();
        expect(screen.getByText('Player 4')).toBeInTheDocument();
    });

    it('closes popover after mouseleave delay', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(ukTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        const path = container.querySelector('svg path')!;
        fireEvent.mouseEnter(path);
        await waitFor(() => expect(screen.getByText('England')).toBeInTheDocument());

        // Switch to fake timers after the async setup is complete so we can
        // advance time without waiting 200 ms of real time.
        vi.useFakeTimers();
        fireEvent.mouseLeave(path);
        act(() => { vi.advanceTimersByTime(200); });
        vi.useRealTimers();

        await waitFor(() => expect(screen.queryByText('England')).not.toBeInTheDocument());
    });

    it('keeps popover open while the dropdown is hovered', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(ukTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        const path = container.querySelector('svg path')!;
        fireEvent.mouseEnter(path);
        await waitFor(() => expect(screen.getByText('England')).toBeInTheDocument());

        vi.useFakeTimers();
        fireEvent.mouseLeave(path);

        // Mouse enters the dropdown before the 200 ms close timer fires
        const dropdown = screen.getByText('England').closest('[data-floating-ui-portal]') ??
            screen.getByText('England').closest('div')!;
        fireEvent.mouseEnter(dropdown);

        // Advancing past the delay should NOT close the popover
        act(() => { vi.advanceTimersByTime(200); });
        vi.useRealTimers();

        expect(screen.getByText('England')).toBeInTheDocument();
    });
});
