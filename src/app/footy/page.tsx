import Image from 'next/image';

export default function Page() {
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
}
