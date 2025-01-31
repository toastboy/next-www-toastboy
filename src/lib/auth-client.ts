import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
    plugins: [
        adminClient(),
        inferAdditionalFields<typeof auth>(),
    ],
    baseURL: process.env.BETTER_AUTH_URL,
});
