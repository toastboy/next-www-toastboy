import Image from 'next/image';
import crest from '../../../public/images/crest.jpg';

export default function Page() {
    return (
        <div className="m-auto w-[283px] rounded overflow-hidden shadow-lg" >
            <Image
                src={crest}
                priority={true}
                alt="Toastboy FC Crest"
            />
        </div>
    );
}
