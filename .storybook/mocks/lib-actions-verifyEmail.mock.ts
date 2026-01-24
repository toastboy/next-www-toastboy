export async function verifyEmailCore() {
    return {
        purpose: 'enquiry',
        email: 'storybook@example.com',
        playerId: null,
    };
}

export async function sendEmailVerificationCore() {
    return undefined;
}
