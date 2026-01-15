import { notifications } from '@mantine/notifications';
import { render, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';

import { SearchParamErrorNotification } from '@/components/SearchParamErrorNotification/SearchParamErrorNotification';
import { Wrapper } from '@/tests/components/lib/common';

describe('SearchParamErrorNotification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows a notification when an error search param exists', async () => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('error=Something%20bad'));
        const showSpy = jest.spyOn(notifications, 'show');

        render(
            <Wrapper>
                <SearchParamErrorNotification />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(showSpy).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Error',
                message: 'Something bad',
            }));
        });
    });

    it('does nothing when there is no error search param', async () => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
        const showSpy = jest.spyOn(notifications, 'show');

        render(
            <Wrapper>
                <SearchParamErrorNotification />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(showSpy).not.toHaveBeenCalled();
        });
    });
});
