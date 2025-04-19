import MustBeLoggedIn from 'components/MustBeLoggedIn/MustBeLoggedIn';
import NYI from 'components/NYI/NYI';
import React from 'react';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <MustBeLoggedIn admin={false}>
            <NYI />
        </MustBeLoggedIn>
    );
};

export default Page;
