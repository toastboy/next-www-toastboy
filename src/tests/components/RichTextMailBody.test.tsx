jest.mock('@tiptap/react', () => ({
    useEditor: jest.fn(() => ({
        getHTML: () => '<p>Test</p>',
    })),
}));

import { render, screen } from '@testing-library/react';

import { RichTextMailBody } from '@/components/RichTextMailBody/RichTextMailBody';
import { Wrapper } from '@/tests/components/lib/common';

describe('RichTextMailBody', () => {
    it('renders rich text editor', () => {
        render(
            <Wrapper>
                <RichTextMailBody />
            </Wrapper>,
        );

        expect(screen.getByText(/Hello, this is a test!/i)).toBeInTheDocument();
    });
});
