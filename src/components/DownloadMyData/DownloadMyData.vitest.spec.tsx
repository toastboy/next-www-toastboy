import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DownloadMyData from '@/components/DownloadMyData/DownloadMyData';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultDownloadMyDataPayload } from '@/tests/mocks/data/downloadMyData';

describe('DownloadMyData', () => {
    it('renders the download and copy controls', () => {
        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        expect(screen.getByRole('button', { name: /download json/i })).toBeInTheDocument();
    });

    it('removes sections from the JSON when unchecked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        const preview = screen.getByTestId('downloadmydata-json-preview');
        expect(preview).toHaveTextContent(/Gary Player/i);
        expect(preview).toHaveTextContent(/"outcomes"/i);

        await user.click(screen.getByTestId('downloadmydata-outcomes-toggle'));

        expect(preview).not.toHaveTextContent(/"outcomes"/i);
    });
});
