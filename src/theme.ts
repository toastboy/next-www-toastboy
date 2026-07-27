import { createTheme } from '@mantine/core';

export const theme = createTheme({
    components: {
        Paper: {
            defaultProps: {
                shadow: 'xl',
            },
        },
    },
});
