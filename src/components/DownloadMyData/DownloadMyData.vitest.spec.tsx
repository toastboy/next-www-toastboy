import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { DownloadMyData } from '@/components/DownloadMyData/DownloadMyData';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultDownloadMyDataPayload } from '@/tests/mocks/data/downloadMyData';

describe('DownloadMyData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the download button', () => {
        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        expect(screen.getByRole('button', { name: /download json/i })).toBeInTheDocument();
    });

    it('removes a section from the JSON when its checkbox is unchecked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        const preview = screen.getByTestId('downloadmydata-json-preview');
        expect(preview).toHaveTextContent(/"outcomes"/i);

        await user.click(screen.getByTestId('downloadmydata-outcomes-toggle'));

        expect(preview).not.toHaveTextContent(/"outcomes"/i);
    });

    it('triggers a file download with the correct filename on button click', async () => {
        const user = userEvent.setup();
        const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
        const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

        let capturedAnchor: HTMLAnchorElement | null = null;
        const origCreateElement = document.createElement.bind(document);
        vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
            const el = options ? origCreateElement(tagName, options) : origCreateElement(tagName);
            if (tagName === 'a') capturedAnchor = el as HTMLAnchorElement;
            return el;
        });

        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /download json/i }));

        expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
        expect(capturedAnchor).not.toBeNull();
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');

        const { playerId, exportedAt } = defaultDownloadMyDataPayload.meta;
        const dateStamp = exportedAt.replace(/[:.]/g, '-');
        expect(capturedAnchor!.download).toBe(`footy-data-${playerId}-${dateStamp}.json`);
    });

    it('removes all sections when Select all is unchecked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        const preview = screen.getByTestId('downloadmydata-json-preview');
        expect(preview).toHaveTextContent(/"meta"/i);

        await user.click(screen.getByLabelText('Select all'));

        expect(preview).not.toHaveTextContent(/"meta"/i);
        expect(preview).not.toHaveTextContent(/"outcomes"/i);
    });

    it('restores all sections when Select all is checked after being cleared', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        const preview = screen.getByTestId('downloadmydata-json-preview');

        await user.click(screen.getByLabelText('Select all'));
        expect(preview).not.toHaveTextContent(/"meta"/i);

        await user.click(screen.getByLabelText('Select all'));
        expect(preview).toHaveTextContent(/"meta"/i);
        expect(preview).toHaveTextContent(/"outcomes"/i);
    });

    it('removes each remaining section from the JSON when its checkbox is unchecked', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <DownloadMyData data={defaultDownloadMyDataPayload} />
            </Wrapper>,
        );

        const preview = screen.getByTestId('downloadmydata-json-preview');

        const sections: [string, string][] = [
            ['Meta', '"meta"'],
            ['Profile', '"profile"'],
            ['Extra emails', '"extraEmails"'],
            ['Countries', '"countries"'],
            ['Clubs', '"clubs"'],
            ['Totals', '"totals"'],
        ];

        for (const [label, jsonKey] of sections) {
            expect(preview).toHaveTextContent(new RegExp(jsonKey, 'i'));
            await user.click(screen.getByLabelText(label));
            expect(preview).not.toHaveTextContent(new RegExp(jsonKey, 'i'));
            await user.click(screen.getByLabelText(label));
        }
    });
});
