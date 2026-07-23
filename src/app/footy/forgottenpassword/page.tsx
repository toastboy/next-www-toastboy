
import { Paper } from '@mantine/core';

import { ForgottenPasswordForm } from '@/components/ForgottenPasswordForm/ForgottenPasswordForm';

export const metadata = { title: 'Forgotten Password' };

const ForgottenPasswordPage = () => {
    return (
        <Paper w="100%" maw="35rem" p="xl">
            <ForgottenPasswordForm />
        </Paper>
    );
};

export default ForgottenPasswordPage;
