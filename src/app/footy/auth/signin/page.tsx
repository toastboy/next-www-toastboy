import { SignIn } from 'components/SignIn/SignIn';
import React from 'react';

type Props = object

const Page: React.FC<Props> = async () => {
    return (
        <SignIn />
    );
};

export default Page;
