import { createTheme } from '@mantine/core';

export const theme = createTheme({
    other: {
        appShellMaxWidth: 1280,
        appShellMinWidth: 320,
    },
    components: {
        Paper: {
            defaultProps: {
                shadow: 'xl',
            },
        },
    },
});
