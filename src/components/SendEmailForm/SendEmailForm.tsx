'use client';

import { Button, Group, Modal, Text, TextInput, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { IconAlertTriangle, IconCheck, IconUser } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { sendEmail } from 'lib/mail';
import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';
import { useState } from 'react';

import classes from './SendEmailForm.module.css';

export interface Props {
    opened: boolean;
    onClose: () => void;
    players: PlayerType[];
}

const SendEmailForm: React.FC<Props> = ({ opened, onClose, players }) => {
    const [subject, setSubject] = useState('');
    const names = players.map((player) => player.name).join(', ');
    const emails = players.map((player) => player.email).join(',');

    const editor = useEditor({
        extensions: [
            Highlight,
            Link,
            Placeholder.configure({ placeholder: 'Message text' }),
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
        ],
        content: '',
        immediatelyRender: false,
    });

    if (!editor) return null;

    const handleSubmit = async () => {
        const id = notifications.show({
            loading: true,
            title: 'Sending email',
            message: 'Sending email...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await sendEmail(emails, subject, editor.getHTML());

            onClose();
            notifications.update({
                id,
                color: 'teal',
                title: 'Email sent',
                message: 'Email sent successfully',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Failed to send:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${err}`,
                icon: <IconAlertTriangle size={18} />,
                loading: false,
                autoClose: 2000,
            });
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Send Mail to Players"
            size="lg"
        >
            <Tooltip label={names} multiline>
                <Text size="sm" mt="sm" lineClamp={1}>
                    <IconUser size={16} className={classes.users} />
                    <strong>To:</strong> {names}
                </Text>
            </Tooltip>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <TextInput
                    label="Subject"
                    value={subject}
                    onChange={(event) => setSubject(event.currentTarget.value)}
                    required
                    mt="md"
                />

                <RichTextEditor editor={editor} mt="md">
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Send Mail</Button>
                </Group>
            </form>
        </Modal>
    );
};

export default SendEmailForm;
