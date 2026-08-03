import {
    createTheme,
} from '@mantine/core';

export const theme = createTheme({
    other: {
        playerNameMinWidthSingleLine: "18em",
        playerNameMinWidthMultiLine: "9em",
    },
    components: {
        Paper: {
            defaultProps: {
                p: 'xl',
                shadow: 'xl',
                withBorder: true,
            },
        },
    },
});
