export const sendEmail = async () => {
    // No-op mail sender for Storybook; avoids pulling nodemailer/net into the bundle.
    return Promise.resolve();
};
