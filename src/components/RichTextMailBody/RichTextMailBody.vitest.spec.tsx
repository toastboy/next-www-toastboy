import { render, screen } from '@testing-library/react';
import { useEditor } from '@tiptap/react';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { RichTextMailBody } from '@/components/RichTextMailBody/RichTextMailBody';
import { Wrapper } from '@/tests/components/lib/common';

const mockUseEditor = useEditor as MockedFunction<typeof useEditor>;

describe('RichTextMailBody', () => {
    it('renders rich text editor with content', () => {
        render(
            <Wrapper>
                <RichTextMailBody />
            </Wrapper>,
        );

        expect(screen.getByText(/Hello, this is a test!/i)).toBeInTheDocument();
    });

    it('renders the toolbar with bold, italic, underline, and link controls', () => {
        render(
            <Wrapper>
                <RichTextMailBody />
            </Wrapper>,
        );

        expect(screen.getByTestId('rich-text-toolbar')).toBeInTheDocument();
        expect(screen.getByTestId('rich-text-bold')).toBeInTheDocument();
        expect(screen.getByTestId('rich-text-italic')).toBeInTheDocument();
        expect(screen.getByTestId('rich-text-underline')).toBeInTheDocument();
        expect(screen.getByTestId('rich-text-link')).toBeInTheDocument();
    });

    it('renders nothing when the editor is not yet initialised', () => {
        mockUseEditor.mockReturnValueOnce(null);

        render(
            <Wrapper>
                <RichTextMailBody />
            </Wrapper>,
        );

        expect(screen.queryByTestId('rich-text-editor')).not.toBeInTheDocument();
        expect(screen.queryByTestId('rich-text-toolbar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('rich-text-content')).not.toBeInTheDocument();
    });
});
