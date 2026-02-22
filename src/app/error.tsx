'use client';

import { Alert, Button, Flex } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useEffect } from 'react';

import { captureUnexpectedError } from '@/lib/observability/sentry';

/**
 * Error boundary page component rendered by Next.js when a client-side error occurs.
 *
 * @param error The error instance that triggered the error boundary.
 * @param reset Callback provided by Next.js to retry rendering the segment when invoked.
 *              This is typically wired to a "Try again" button to allow recovery.
 */
const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
    useEffect(() => {
        captureUnexpectedError(error, {
            layer: 'client',
            component: 'ErrorPage',
            route: '/app/error',
        });
    }, [error]);

    return (
        <Alert title="Error" icon={<IconAlertTriangle />} color="red">
            <Flex direction="column">
                {error.message || 'Something went wrong'}
                <Button w="10rem" onClick={() => reset()} mt="sm">
                    Try again
                </Button>
            </Flex>
        </Alert>
    );
};

export default ErrorPage;
