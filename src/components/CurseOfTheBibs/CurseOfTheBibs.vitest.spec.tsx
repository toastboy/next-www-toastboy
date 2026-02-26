import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { CurseOfTheBibs } from '@/components/CurseOfTheBibs/CurseOfTheBibs';
import { Props as PieChartProps } from '@/components/PieChart/PieChart';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultBibsData } from '@/tests/mocks/data/bibs';

vi.mock('@/components/PieChart/PieChart');

describe('CurseOfTheBibs', () => {
    it('maps bibs data to pie chart data', () => {
        render(
            <Wrapper>
                <CurseOfTheBibs bibsData={defaultBibsData} />
            </Wrapper>,
        );

        const props = extractMockProps<PieChartProps>('PieChart');
        expect(props).toHaveLength(1);
        expect(props[0].data).toEqual([
            { label: 'won', value: defaultBibsData.won },
            { label: 'drawn', value: defaultBibsData.drawn },
            { label: 'lost', value: defaultBibsData.lost },
        ]);
    });
});

