import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { MoneyChart } from '@/components/MoneyChart/MoneyChart';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultMoneyChartData } from '@/tests/mocks/data/money';

class ImmediateResizeObserver {
    private callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe(_target: Element) {
        const entry = { contentRect: { width: 600, height: 300 } };
        this.callback([entry as unknown as ResizeObserverEntry], this);
    }
    unobserve() { /* empty */ }
    disconnect() { /* empty */ }
}

// D3 axes produce only <path> and <line> elements (no <rect>), so:
//   svg rects [0..5]  = debit bars (one per interval)
//   svg rects [6..11] = credit bars
//   svg rects [12..] = legend swatches
// D3 dots come before hit circles:
//   svg circles [0..5] = visible dots (r=4)
//   svg circles [6..11] = invisible hit targets (r=10)
const N = defaultMoneyChartData.length; // 6

describe('MoneyChart', () => {
    beforeEach(() => {
        vi.stubGlobal('ResizeObserver', ImmediateResizeObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows empty state when data is empty', () => {
        render(
            <Wrapper>
                <MoneyChart data={[]} />
            </Wrapper>,
        );

        expect(screen.getByText('No transaction data available.')).toBeInTheDocument();
    });

    it('renders chart with bars and balance line for each data interval', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        const rects = container.querySelectorAll('svg rect');
        expect(rects.length).toBeGreaterThanOrEqual(N * 2);

        const paths = container.querySelectorAll('svg path');
        expect(paths.length).toBeGreaterThan(0);
    });

    it('renders legend labels', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        const svgTexts = Array.from(container.querySelectorAll('svg text')).map(el => el.textContent);
        expect(svgTexts).toContain('Player payments (credits)');
        expect(svgTexts).toContain('Hall charges (debits)');
        expect(svgTexts).toContain('Running balance');
    });

    it('renders an axis label for each interval', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        const svgTexts = Array.from(container.querySelectorAll('svg text')).map(el => el.textContent);
        for (const { interval } of defaultMoneyChartData) {
            expect(svgTexts).toContain(interval);
        }
    });

    it('shows hall-charges tooltip when hovering a debit bar', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        const { interval, debits } = defaultMoneyChartData[0];
        const tooltipDiv = container.querySelector('svg')!.nextElementSibling as HTMLElement;

        fireEvent.mouseMove(container.querySelectorAll('svg rect')[0]);

        expect(tooltipDiv.style.opacity).toBe('1');
        expect(tooltipDiv.innerHTML).toContain(interval);
        expect(tooltipDiv.innerHTML).toContain('Hall charges');
        expect(tooltipDiv.innerHTML).toContain(`£${debits.toFixed(2)}`);
    });

    it('shows player-payments tooltip when hovering a credit bar', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        const { interval, credits } = defaultMoneyChartData[0];
        const tooltipDiv = container.querySelector('svg')!.nextElementSibling as HTMLElement;

        fireEvent.mouseMove(container.querySelectorAll('svg rect')[N]);

        expect(tooltipDiv.style.opacity).toBe('1');
        expect(tooltipDiv.innerHTML).toContain(interval);
        expect(tooltipDiv.innerHTML).toContain('Player payments');
        expect(tooltipDiv.innerHTML).toContain(`£${credits.toFixed(2)}`);
    });

    it('shows balance tooltip when hovering a dot hit target', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        // Jan: credits(120) - debits(80) = running balance of 40
        const { interval } = defaultMoneyChartData[0];
        const expectedBalance = (defaultMoneyChartData[0].credits - defaultMoneyChartData[0].debits).toFixed(2);
        const tooltipDiv = container.querySelector('svg')!.nextElementSibling as HTMLElement;

        fireEvent.mouseMove(container.querySelectorAll('svg circle')[N]);

        expect(tooltipDiv.style.opacity).toBe('1');
        expect(tooltipDiv.innerHTML).toContain(interval);
        expect(tooltipDiv.innerHTML).toContain('Balance');
        expect(tooltipDiv.innerHTML).toContain(`£${expectedBalance}`);
    });

    it('hides tooltip on mouseleave', () => {
        const { container } = render(
            <Wrapper>
                <MoneyChart data={defaultMoneyChartData} />
            </Wrapper>,
        );

        const debitBar = container.querySelectorAll('svg rect')[0];
        const tooltipDiv = container.querySelector('svg')!.nextElementSibling as HTMLElement;

        fireEvent.mouseMove(debitBar);
        expect(tooltipDiv.style.opacity).toBe('1');

        fireEvent.mouseLeave(debitBar);
        expect(tooltipDiv.style.opacity).toBe('0');
    });
});
