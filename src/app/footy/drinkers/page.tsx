import MustBeAdmin from 'components/MustBeAdmin/MustBeAdmin';
import NYI from 'components/NYI/NYI';
import React from 'react';

type Props = object

const Page: React.FC<Props> = async () => {
    return (
        <MustBeAdmin>
            <NYI />
        </MustBeAdmin>
    );
};

export default Page;
