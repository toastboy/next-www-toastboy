'use client';

import { Link, RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const RichTextMailBody = () => {
    const editor = useEditor({
        extensions: [StarterKit, Link],
        content: '<p>Hello, this is a test!</p>',
    });

    if (!editor) return null;

    return (
        <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Link />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
        </RichTextEditor>
    );
};

export default RichTextMailBody;
