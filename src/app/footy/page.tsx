import { Anchor, Divider, Image, Stack, Text } from '@mantine/core';

const HomePage = () => {
    return (
        <Stack w="100%" p="xl" align="center">
            <Image
                src="/crest.jpg"
                width={283}
                height={342}
                alt="Toastboy FC Crest"
                fit="contain" />
            <Divider my="md" w="100%" />
            <Text mt="md">
                Who are we?{' '}
                <Anchor href="/footy/info">Information about Toastboy FC</Anchor>
            </Text>
            <Text mt="md">
                Crest design ©2003 by Joe Bright
            </Text>
        </Stack>
    );
};

export default HomePage;
