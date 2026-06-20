'use client';

import { Box, Button, Group, Modal, Text, TextInput, Tooltip } from '@mantine/core';
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

import { config } from '@/lib/config';
import { normalizeEmail } from '@/lib/email/normalizeEmail';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { PlayerDataEmailDisplayType } from '@/types';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

import classes from './SendEmailForm.module.css';

export interface Props {
    opened: boolean;
    onClose: () => void;
    players: PlayerDataEmailDisplayType[];
    onSendEmail: SendEmailProxy;
    withinPortal?: boolean;
    withOverlay?: boolean;
}

export const SendEmailForm = ({
    opened,
    onClose,
    players,
    onSendEmail,
    withinPortal,
    withOverlay,
}: Props) => {
    const [subject, setSubject] = useState('');
    const names = players.map(({ name }) => name).join(', ');
    const emails = Array.from(new Set(players.flatMap((player) => {
        const verifiedExtraEmails = player.extraEmails.filter((playerEmail) => playerEmail.verified);
        const preferredExtraEmails = verifiedExtraEmails.length > 0 ? verifiedExtraEmails : player.extraEmails;
        return [player.accountEmail, ...preferredExtraEmails.map((playerEmail) => playerEmail.email)];
    }).map(normalizeEmail).filter((email) => email.length > 0))).join(',');

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
            await onSendEmail({
                to: emails,
                subject,
                html: editor.getHTML(),
            });

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
            captureUnexpectedError(err, {
                layer: 'client',
                component: 'SendEmailForm',
                action: 'sendEmail',
                route: '/footy/admin/players',
                extra: {
                    recipientCount: players.length,
                },
            });
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: toPublicMessage(err, 'Failed to send email.'),
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
                    <Tooltip label="No valid email addresses for the selected players" disabled={!!emails}>
                        <Box component="span">
                            <Button type="submit" disabled={!emails}>Send Mail</Button>
                        </Box>
                    </Tooltip>
                </Group>
            </form>
        </Modal>
    );
};
