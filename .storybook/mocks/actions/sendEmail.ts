/**
 * Storybook stub for sendEmail action to prevent real email dispatch during UI previews.
 * @returns Promise resolving to undefined for compatibility with production signature.
 */
export async function sendEmail() {
    return undefined;
}
