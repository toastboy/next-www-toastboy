import Image from 'next/image';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <div className="m-auto w-[283px] rounded overflow-hidden shadow-lg" >
            <Image
                src="/crest.jpg"
                width={283}
                height={342}
                priority={true}
                alt="Toastboy FC Crest"
            />
        </div>
    );
};

export default Page;
