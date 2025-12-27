// Backend tests run in Node; no MSW server by default.

const silenceConsole = () => {
    const noop = () => undefined;
    const spies = [
        jest.spyOn(console, 'log').mockImplementation(noop),
        jest.spyOn(console, 'info').mockImplementation(noop),
        jest.spyOn(console, 'warn').mockImplementation(noop),
        jest.spyOn(console, 'error').mockImplementation(noop),
        jest.spyOn(console, 'debug').mockImplementation(noop),
    ];

    afterAll(() => {
        for (const spy of spies) {
            spy.mockRestore();
        }
    });
};

if (process.env.JEST_SILENCE_CONSOLE !== 'false') {
    silenceConsole();
}
