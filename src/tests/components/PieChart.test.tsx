import { render } from '@testing-library/react';

import { PieChart } from '@/components/PieChart/PieChart';

import { Wrapper } from './lib/common';

describe('PieChart', () => {
    it('renders svg element', () => {
        const data = [
            { label: 'Category A', value: 30 },
            { label: 'Category B', value: 70 },
        ];

        const { container } = render(
            <Wrapper>
                <PieChart data={data} />
            </Wrapper>,
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });
});
