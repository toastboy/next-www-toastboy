'use client';

import { SignIn } from 'components/SignIn/SignIn';
import { authClient } from 'lib/authClient';
import config from 'lib/config';
import { ReactNode, Suspense, useEffect, useState } from 'react';

type Props = {
    children: ReactNode;
    admin?: boolean;
    showSignIn?: boolean;
    onValidationChange?: (isValid: boolean) => void;
};

/**
 * A React component that ensures the user is logged in before rendering its children.
 * Optionally, it can enforce admin privileges and display a sign-in prompt if the user is not authenticated.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to render if the user is authenticated.
 * @param {boolean} [props.admin] - If `true`, the user must have admin privileges to pass validation.
 * @param {boolean} [props.showSignIn] - If `true`, displays a sign-in prompt when the user is not authenticated.
 * @param {(isValid: boolean) => void} [props.onValidationChange] - A callback function that is called whenever the validation status changes.
 *
 * @returns {React.ReactElement | null} The rendered component or `null` while the session status is being determined.
 *
 * @remarks
 * - This component uses `authClient` to check the user's session and privileges.
 * - While the session status is being determined, it renders `null` to allow a loading state to take over.
 * - If the user is not authenticated and `showSignIn` is `true`, a `SignIn` component is rendered with an appropriate message.
 * - If the user is authenticated, the child components are rendered within a `Suspense` boundary.
 */
function MustBeLoggedIn({ children, admin = false, showSignIn = true, onValidationChange }: Props) {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const session = authClient.useSession();

    useEffect(() => {
        const checkSession = async () => {
            if (!session.isPending) {
                const valid = admin ? authClient.isAdmin(session) : authClient.isLoggedIn(session);
                setIsValid(valid);
                if (onValidationChange) {
                    onValidationChange(valid);
                }
            }
        };

        checkSession();
        const interval = setInterval(checkSession, config.sessionRevalidate);

        return () => clearInterval(interval);
    }, [admin, onValidationChange, session, session?.data?.user]);

    if (isValid === null) {
        // While the session status is being determined, render nothing to allow
        // loading.tsx to take over.
        return null;
    }

    if (!isValid) {
        if (showSignIn) {
            return <SignIn title={`You must be logged in${admin ? ' as an administrator' : ''} to use this page.`} />;
        }
        else {
            return <></>;
        }
    }

    return (
        <Suspense>
            {children}
        </Suspense>
    );
}

export default MustBeLoggedIn;
