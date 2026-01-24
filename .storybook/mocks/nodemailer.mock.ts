export function createTransport() {
    return {
        async sendMail() {
            return undefined;
        },
    };
}

export default {
    createTransport,
};
