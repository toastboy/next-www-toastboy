'use client';

import { Alert, Button, Flex } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
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
