import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DownloadMyData from '@/components/DownloadMyData/DownloadMyData';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultDownloadMyDataPayload } from '@/tests/mocks';

describe('DownloadMyData', () => {
    it('renders the download and copy controls', () => {
        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        expect(screen.getByRole('button', { name: /download json/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/copy json/i)).toBeInTheDocument();
    });

    it('removes sections from the JSON when unchecked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        expect(screen.getByText(/Gary Player/i)).toBeInTheDocument();
        expect(screen.getByText(/"outcomes"/i)).toBeInTheDocument();

        await user.click(screen.getByLabelText(/Games played/i));

        expect(screen.queryByText(/"outcomes"/i)).not.toBeInTheDocument();
    });
});
