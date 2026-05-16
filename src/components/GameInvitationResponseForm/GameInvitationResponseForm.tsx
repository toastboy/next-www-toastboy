'use client';

import {
    Anchor,
    Avatar,
    Badge,
    Box,
    Button,
    Checkbox,
    Flex,
    NativeSelect,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { PlayerResponse } from 'prisma/generated/enums';
import { useState } from 'react';
import { z } from 'zod';

import { config } from '@/lib/config';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import {
    InvitationResponseInputSchema,
    SubmitGameInvitationResponseProxy,
} from '@/types/actions/SubmitGameInvitationResponse';
import { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

const formSchema = InvitationResponseInputSchema.omit({ token: true }).extend({
    comment: z.string().max(127).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const responseOptions = [
    { value: PlayerResponse.Yes, label: 'Yes' },
    { value: PlayerResponse.No, label: 'No' },
    { value: PlayerResponse.Dunno, label: 'Dunno' },
];

/**
 * Responses that players can select themselves in this form.
 */
const playerEditableResponses = new Set<PlayerResponse>([
    PlayerResponse.Yes,
    PlayerResponse.No,
    PlayerResponse.Dunno,
]);

/**
 * Returns the initial response value used by the editable select input.
 *
 * Player invitations can carry admin-only response values (for example
 * `Excused`) that should still be displayed in the summary, but players can
 * only submit Yes/No/Dunno from this form.
 *
 * @param response - Incoming invitation response from query details.
 * @returns The player-editable response value for the form select.
 */
function getInitialPlayerResponse(responseInput: GameInvitationResponseDetails['response']) {
    const response = responseInput &&
        playerEditableResponses.has(responseInput) ? responseInput : PlayerResponse.Yes;

    return response;
}

interface Props {
    details: GameInvitationResponseDetails;
    onSubmitGameInvitationResponse: SubmitGameInvitationResponseProxy;
}

export const GameInvitationResponseForm = ({
    details,
    onSubmitGameInvitationResponse,
}: Props) => {
    const response = getInitialPlayerResponse(details.response);
    const [currentResponse, setCurrentResponse] = useState(details.response);
    const [currentComment, setCurrentComment] = useState(details.comment);
    const [canSubmitWithoutChanges, setCanSubmitWithoutChanges] = useState(!details.response);

    const form = useForm<FormValues>({
        initialValues: {
            response,
            goalie: details.goalie ?? false,
            comment: details.comment ?? '',
        },
        validate: zod4Resolver(formSchema),
        validateInputOnBlur: true,
    });

    /**
     * The form is dirty if the user has changed a field, or if there is no
     * saved response yet. In that case, submission is allowed without
     * interaction so users can quickly confirm the default Yes value. Once a
     * response has been saved, the button should disable again until the form
     * changes.
     */
    const isFormDirty = form.isDirty() || canSubmitWithoutChanges;

    const handleSubmit = async (values: FormValues) => {
        const id = notifications.show({
            loading: true,
            title: 'Saving response',
            message: 'Saving your response...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await onSubmitGameInvitationResponse({
                token: details.token,
                response: values.response,
                goalie: values.goalie,
                comment: values.comment?.trim() ?? null,
            });

            setCurrentResponse(values.response);
            setCurrentComment(values.comment?.trim() ?? '');
            setCanSubmitWithoutChanges(false);

            notifications.update({
                id,
                color: 'teal',
                title: 'Response saved',
                message: 'Your response has been updated.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                component: 'GameInvitationResponseForm',
                action: 'submitResponse',
                route: '/footy/game/[id]',
                extra: {
                    playerId: details.playerId,
                    gameDayId: details.gameDayId,
                    response: values.response,
                },
            });
            const message = error instanceof Error ? error.message : 'Failed to save response';
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    const responseColor = {
        [PlayerResponse.Yes.toString()]: 'green',
        [PlayerResponse.No.toString()]: 'red',
        [PlayerResponse.Dunno.toString()]: 'grey',
    } as const;
    const displayResponse = currentResponse ? (
        <Badge color={responseColor[currentResponse.toString()]} variant="filled" size="sm">
            {currentResponse}
        </Badge>
    ) : (
        <Badge color="grey" variant="filled" size="sm">
            No response yet
        </Badge>
    );
    const displayComment = currentComment ? `("${currentComment}")` : '';
    const playerLink = details.playerLogin ? `/footy/player/${details.playerLogin}` : `/footy/player/${details.playerId}`;

    return (
        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
                <Title order={2}>
                    {currentResponse ? 'Thanks for Your Response' : 'Enter Your Response'}
                </Title>
                <Flex align="center" gap="md" wrap="wrap">
                    <Avatar
                        src={`/api/footy/player/${details.playerId}/mugshot`}
                        alt={details.playerName}
                        size={48}
                        radius="xl"
                    />
                    <Anchor href={playerLink}>{details.playerName}</Anchor>: {displayResponse} {displayComment}
                </Flex>
                <Text>
                    You can change it later if you need to, even if the teams have been picked - either by clicking
                    on the link in the email you received, or by logging in to the site at{' '}
                    <Anchor href={`/footy/game/${details.gameDayId}`}>the game page</Anchor>. If you can&apos;t get to
                    a computer, call my mobile on <strong>{config.organiserPhoneNumber}</strong>.
                </Text>
                <Text>Cheers,</Text>
                <Text>Jon</Text>
                <NativeSelect
                    label="Response"
                    data={responseOptions}
                    {...form.getInputProps('response')}
                />
                <Checkbox
                    label="Goalie"
                    {...form.getInputProps('goalie', { type: 'checkbox' })}
                />
                <TextInput
                    label="Optional comment/excuse"
                    maxLength={127}
                    {...form.getInputProps('comment')}
                />
                <Button type="submit" w="fit-content" disabled={!isFormDirty}>
                    Save Response
                </Button>
            </Stack>
        </Box>
    );
};
