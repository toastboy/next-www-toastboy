export async function verifyEmail() {
    return {
        purpose: 'enquiry',
        email: 'storybook@example.com',
        playerId: null,
    };
}

export async function sendEmailVerification() {
    return undefined;
}
