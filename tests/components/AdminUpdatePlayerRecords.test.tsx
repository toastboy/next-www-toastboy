import { render, screen } from '@testing-library/react';
import AdminUpdatePlayerRecords from 'components/AdminUpdatePlayerRecords';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { useRecordsProgress } from 'lib/swr';

jest.mock('lib/swr');

describe('AdminUpdatePlayerRecords', () => {
    it('renders loading state', () => {
        (useRecordsProgress as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useRecordsProgress as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useRecordsProgress as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data < 100%', () => {
        (useRecordsProgress as jest.Mock).mockReturnValue({
            data: [800, 2000],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("40%")).toBeInTheDocument();
    });

    it('renders with data == 100%', () => {
        (useRecordsProgress as jest.Mock).mockReturnValue({
            data: [2000, 2000],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><AdminUpdatePlayerRecords /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(container.querySelector('.tabler-icon-check')).toBeInTheDocument();
    });
});
