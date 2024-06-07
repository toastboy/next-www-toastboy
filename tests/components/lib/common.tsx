import { ReactNode } from "react";
import { MantineProvider } from '@mantine/core';

export const loaderClass = '.mantine-Loader-root';
export const errorText = 'failed to load';

interface WrapperProps {
    children?: ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <MantineProvider>
            {children}
        </MantineProvider>
    );
};
