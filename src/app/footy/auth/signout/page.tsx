'use client';

import { useEffect, useState } from 'react';
import { authClient } from "src/lib/auth-client";

export default function LogoutPage() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function handleLogout() {
            try {
                await authClient.signOut();
            } catch (error) {
                console.error("Failed to log out:", error);
            }
        }

        handleLogout();
    }, []);

    return (
        <div>
            <h1>Successfully logged out</h1>
        </div>
    );
}
