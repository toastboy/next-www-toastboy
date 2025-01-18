import { Box, Image } from "@mantine/core";

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <Box className="m-auto w-[283px] rounded overflow-hidden shadow-lg" >
            <Image
                src="/crest.jpg"
                width={283}
                height={342}
                alt="Toastboy FC Crest"
            />
        </Box>
    );
};

export default Page;
