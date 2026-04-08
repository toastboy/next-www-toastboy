import { render } from '@testing-library/react';
import { afterAll, beforeAll, vi } from 'vitest';

import { PlayerCountryMap } from '@/components/PlayerCountryMap/PlayerCountryMap';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultCountrySupporterWithPlayerDataList } from '@/tests/mocks/data/countrySupporterWithPlayerData';

describe('PlayerCountryMap', () => {
    /** Stub fetch to prevent happy-dom AbortError noise during teardown. */
    const originalFetch = global.fetch;

    beforeAll(() => {
        global.fetch = vi.fn().mockImplementation(() =>
            Promise.resolve(
                new Response(
                    JSON.stringify({
                        type: 'Topology',
                        objects: { countries: { type: 'GeometryCollection', geometries: [] } },
                        arcs: [],
                    }),
                    { headers: { 'Content-Type': 'application/json' } },
                ),
            ),
        );
    });

    afterAll(() => {
        global.fetch = originalFetch;
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
});
