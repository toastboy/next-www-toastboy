// See: https://nextjs.org/docs/app/api-reference/file-conventions/loading

import { Flex, Loader } from '@mantine/core';

const Loading = () => {
    return (
        <Flex justify="center" align="center" h="100vh">
            <Loader data-testid="loading" color="gray" type="dots" />
        </Flex>
    );
};

export default Loading;
