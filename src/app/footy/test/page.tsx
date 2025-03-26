'use client';

import { Anchor, Button, Popover, Stack } from "@mantine/core";
import RichTextMailBody from "components/RichTextMailBody/RichTextMailBody";
import { sendEmail } from "lib/mail";

const MailAnchor = () => {
    const subject = encodeURIComponent("Test Message");
    const body = encodeURIComponent("Hello!\nThis was pre-filled.");
    const recipients = encodeURIComponent([
        '"Test" <test@toastboy.co.uk>',
        '"Boy of Toast" <toastboy@gmail.com>',
    ].join(";"));

    const mailto = `mailto:${recipients}?subject=${subject}&body=${body}`;

    return <Anchor href={mailto}>Send Email</Anchor>;
};

type Props = object

const Page: React.FC<Props> = () => {
    const handleSendEmail = async () => {
        await sendEmail('toastboy70@gmail.com', 'Test Message', '<p>Hello!</p>');
    };

    return (
        <Stack>
            <Button onClick={handleSendEmail}>Send Email</Button>
            <MailAnchor />
            <Popover>
                <RichTextMailBody />
            </Popover>
        </Stack>
    );
};

export default Page;
