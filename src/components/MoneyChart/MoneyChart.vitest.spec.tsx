import { render } from '@testing-library/react';

import { MoneyChart } from '@/components/MoneyChart/MoneyChart';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultMoneyChartData } from '@/tests/mocks/data/money';

describe('MoneyChart', () => {
    it('renders svg element', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });
});
