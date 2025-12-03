import useSWR from 'swr';

interface MockUseSWROptions<Data = unknown, Error = unknown> {
    data?: Data;
    error?: Error;
    isLoading?: boolean;
    mutate?: jest.Mock;
}

jest.mock('swr');

export const mockUseSWR = <Data = unknown, Error = unknown>(
    options: MockUseSWROptions<Data, Error> = {},
): { mutate: jest.Mock } => {
    const { data, error, isLoading = false, mutate = jest.fn() } = options;

    (useSWR as jest.Mock).mockReturnValue({
        data,
        error,
        isLoading,
        mutate,
    });

    return { mutate };
};

export const resetUseSWRMock = () => {
    (useSWR as jest.Mock).mockReset();
};
