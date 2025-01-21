'use client';

import { Container, Loader, Text } from '@mantine/core';
import * as Sentry from '@sentry/react';
import { useEffect, useState } from 'react';
import { authClient } from "src/lib/auth-client";

export default function LogoutPage() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function handleLogout() {
            setLoading(true);
            setErrorMessage(null);

            try {
                await authClient.signOut();
            } catch (error) {
                Sentry.captureMessage(`Sign out error: ${error}`, 'error');
            }
            finally {
                setLoading(false);
            }
        }

        handleLogout();
    }, []);

    if (loading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

    if (errorMessage) {
        return (
            <Container>
                <Text color="red">{errorMessage}</Text>
            </Container>
        );
    }

    return (
        <div>
            <h1>Successfully logged out</h1>
        </div>
    );
}
