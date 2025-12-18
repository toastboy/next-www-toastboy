import { Center, Image } from '@mantine/core';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <Center w="100%" p="xl">
            <Image
                src="/crest.jpg"
                width={283}
                height={342}
                alt="Toastboy FC Crest"
                fit="contain"
            />
        </Center>
    );
};

export default Page;
