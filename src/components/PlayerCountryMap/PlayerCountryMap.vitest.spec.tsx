import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { vi } from 'vitest';

import { PlayerCountryMap } from '@/components/PlayerCountryMap/PlayerCountryMap';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockCountry } from '@/tests/mocks/data/country';
import {
    createMockCountrySupporterWithPlayerData,
    defaultCountrySupporterWithPlayerDataList,
} from '@/tests/mocks/data/countrySupporterWithPlayerData';
import { createMockPlayer } from '@/tests/mocks/data/player';

const originalFetch = global.fetch;

const makeTopologyResponse = (topology: object | null) =>
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

// Two-country topology: UK (supported) + France (not supported).
const ukAndFranceTopology = {
    type: 'Topology',
    objects: {
        countries: {
            type: 'GeometryCollection',
            geometries: [
                { type: 'Polygon', arcs: [[0]], properties: { name: 'United Kingdom' } },
                { type: 'Polygon', arcs: [[1]], properties: { name: 'France' } },
            ],
        },
    },
    arcs: [[[-5, 50], [1, 50], [1, 59]], [[2, 43], [8, 43], [8, 50]]],
};

// Topology whose single feature has null properties.
const nullPropsTopology = {
    type: 'Topology',
    objects: {
        countries: {
            type: 'GeometryCollection',
            geometries: [{ type: 'Polygon', arcs: [[0]], properties: null }],
        },
    },
    arcs: [[[-5, 50], [1, 50], [1, 59], [-5, 59]]],
};

// Topology for a country whose name has no entry in COUNTRY_NAME_MAP.
const germanyTopology = {
    type: 'Topology',
    objects: {
        countries: {
            type: 'GeometryCollection',
            geometries: [{ type: 'Polygon', arcs: [[0]], properties: { name: 'Germany' } }],
        },
    },
    arcs: [[[6, 47], [15, 47], [15, 55], [6, 55]]],
};

const germanySupporterList = [
    createMockCountrySupporterWithPlayerData({
        playerId: 99,
        countryFIFACode: 'GER',
        country: createMockCountry({ fifaCode: 'GER', name: 'Germany' }),
        player: createMockPlayer({ id: 99, name: 'German Player' }),
    }),
];

const nullNameSupporterList = [
    createMockCountrySupporterWithPlayerData({
        playerId: 42,
        countryFIFACode: 'ENG',
        country: createMockCountry({ fifaCode: 'ENG', name: 'England' }),
        player: { id: 42, name: null } satisfies PlayerType,
    }),
];

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

    it('handles null topology gracefully', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(null));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        // No paths should be drawn, but the SVG itself must still render
        await waitFor(() => expect(container.querySelector('svg')).toBeInTheDocument());
        expect(container.querySelectorAll('svg path')).toHaveLength(0);
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

    it('colours unsupported country grey and does not open popover on hover', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(ukAndFranceTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(2));

        const paths = container.querySelectorAll('svg path');
        const fills = Array.from(paths).map((p) => p.getAttribute('fill'));
        expect(fills).toContain('#228be6');
        expect(fills).toContain('#ccc');

        // Hovering the grey (unsupported) country must not open a popover
        const greyPath = Array.from(paths).find((p) => p.getAttribute('fill') === '#ccc')!;
        fireEvent.mouseEnter(greyPath);
        expect(screen.queryByTestId('country-popover-dropdown')).not.toBeInTheDocument();
    });

    it('handles topology features with null properties', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(nullPropsTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        // The feature has null properties, so it gets the default grey fill
        const path = container.querySelector('svg path')!;
        expect(path).toHaveAttribute('fill', '#ccc');

        // Hovering a null-properties path should not open the popover
        fireEvent.mouseEnter(path);
        expect(screen.queryByTestId('country-popover-dropdown')).not.toBeInTheDocument();
    });

    it('maps unmapped country name to itself via toAtlasName fallback', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(germanyTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={germanySupporterList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        // Germany is not in COUNTRY_NAME_MAP so the atlas key stays "Germany"
        expect(container.querySelector('svg path')).toHaveAttribute('fill', '#228be6');

        fireEvent.mouseEnter(container.querySelector('svg path')!);
        await waitFor(() => expect(screen.getByText('Germany')).toBeInTheDocument());
        expect(screen.getByText('German Player')).toBeInTheDocument();
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

    it('shows fallback player name when player.name is null', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(ukTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={nullNameSupporterList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        fireEvent.mouseEnter(container.querySelector('svg path')!);
        await waitFor(() => expect(screen.getByText('Player 42')).toBeInTheDocument());
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
        fireEvent.mouseEnter(screen.getByTestId('country-popover-dropdown'));

        // Advancing past the delay should NOT close the popover
        act(() => { vi.advanceTimersByTime(200); });
        vi.useRealTimers();

        expect(screen.getByText('England')).toBeInTheDocument();
    });

    it('closes popover when mouse leaves dropdown', async () => {
        global.fetch = vi.fn().mockResolvedValue(makeTopologyResponse(ukTopology));

        const { container } = render(
            <Wrapper>
                <PlayerCountryMap countries={defaultCountrySupporterWithPlayerDataList} />
            </Wrapper>,
        );

        await waitFor(() => expect(container.querySelectorAll('svg path')).toHaveLength(1));

        fireEvent.mouseEnter(container.querySelector('svg path')!);
        await waitFor(() => expect(screen.getByText('England')).toBeInTheDocument());

        const dropdown = screen.getByTestId('country-popover-dropdown');
        fireEvent.mouseEnter(dropdown);

        vi.useFakeTimers();
        fireEvent.mouseLeave(dropdown);
        act(() => { vi.advanceTimersByTime(200); });
        vi.useRealTimers();

        await waitFor(() => expect(screen.queryByText('England')).not.toBeInTheDocument());
    });
});
