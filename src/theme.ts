import {
    createTheme,
} from '@mantine/core';

export const theme = createTheme({
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
