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
import { useState } from 'react';
import { PlayerDataType } from 'types';

import { config } from '@/lib/config';
import { SendEmailProxy } from '@/types/actions/SendEmail';

import classes from './SendEmailForm.module.css';

export interface Props {
    opened: boolean;
    onClose: () => void;
    players: PlayerDataType[];
    onSendEmail: SendEmailProxy;
    withinPortal?: boolean;
    withOverlay?: boolean;
}

export const SendEmailForm: React.FC<Props> = ({
    opened,
    onClose,
    players,
    onSendEmail,
    withinPortal,
    withOverlay,
}) => {
    const [subject, setSubject] = useState('');
    const names = players.map((player) => player.name).join(', ');
    const emails = Array.from(new Set(players.flatMap((player) => {
        const verifiedExtraEmails = player.extraEmails.filter((playerEmail) => playerEmail.verifiedAt);
        const preferredExtraEmails = verifiedExtraEmails.length > 0 ? verifiedExtraEmails : player.extraEmails;
        return [player.accountEmail, ...preferredExtraEmails.map((playerEmail) => playerEmail.email)];
    }).filter((email): email is string => !!email && email.length > 0))).join(',');

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
            await onSendEmail(emails, "", subject, editor.getHTML());

            onClose();
            notifications.update({
                id,
                color: 'teal',
                title: 'Email sent',
                message: 'Email sent successfully',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            console.error('Failed to send:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(err)}`,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Send Mail to Players"
            size="lg"
            withinPortal={withinPortal}
            withOverlay={withOverlay}
        >
            <Tooltip label={names} multiline>
                <Text size="sm" mt="sm" lineClamp={1}>
                    <IconUser size={16} className={classes.users} />
                    <strong>To:</strong> {names}
                </Text>
            </Tooltip>
            <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
                <TextInput
                    label="Subject"
                    data-testid="send-email-subject"
                    value={subject}
                    onChange={(event) => setSubject(event.currentTarget.value)}
                    required
                    mt="md"
                />

                <RichTextEditor editor={editor} mt="md" data-testid="send-email-editor">
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

                    <RichTextEditor.Content data-testid="send-email-body" />
                </RichTextEditor>

                <Group justify="flex-end" mt="md">
                    <Button type="submit" data-testid="send-email-submit">Send Mail</Button>
                </Group>
            </form>
        </Modal>
    );
};
