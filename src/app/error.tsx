'use client';

import { Alert, Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
    return (
        <Alert title="Error" icon={<IconAlertTriangle />} color="red">
            {error.message || 'Something went wrong'}
            <Button onClick={() => reset()} mt="sm">
                Try again
            </Button>
        </Alert>
    );
};

export default ErrorPage;
