'use client';

import { CodeHighlightAdapterProvider, createShikiAdapter } from '@mantine/code-highlight';
import { createHighlighter, type Highlighter } from 'shiki';

interface Props {
    children: React.ReactNode;
}

// See https://mantine.dev/x/code-highlight/
async function loadShiki(): Promise<Highlighter> {
    const createHighlighterSafe = createHighlighter as unknown as (options: {
        langs: string[];
        themes: string[];
    }) => Promise<Highlighter>;
    return await createHighlighterSafe({
        langs: ['tsx', 'scss', 'html', 'bash', 'json'],
        themes: [],
    });
}

const shikiAdapter = createShikiAdapter(loadShiki);

export const CodeHighlightProvider: React.FC<Props> = ({ children }) => {
    return (
        <CodeHighlightAdapterProvider adapter={shikiAdapter}>
            {children}
        </CodeHighlightAdapterProvider>
    );
};

export default CodeHighlightProvider;
