'use client';

import {
    BoldControl,
    ItalicControl,
    Link,
    RichTextEditor,
    RichTextEditorContent,
    RichTextEditorControlsGroup,
    RichTextEditorLinkControl,
    UnderlineControl,
} from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const RichTextMailBody = () => {
    const editor = useEditor({
        extensions: [StarterKit, Link],
        content: '<p>Hello, this is a test!</p>',
    });

    if (!editor) return null;

    return (
        <RichTextEditor editor={editor}>
            {/* RichTextEditor.Toolbar has no standalone named export in @mantine/tiptap,
                so this is the one dot-notation exception to the no-dot-notation rule.
                Safe here since this file is 'use client'. See CLAUDE.md. */}
            <RichTextEditor.Toolbar sticky>
                <RichTextEditorControlsGroup>
                    <BoldControl />
                    <ItalicControl />
                    <UnderlineControl />
                    <RichTextEditorLinkControl />
                </RichTextEditorControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditorContent />
        </RichTextEditor>
    );
};
