import { Image, type ImageProps } from '@mantine/core';
import type { CountryType } from 'prisma/zod/schemas/models/Country.schema';

export interface Props {
    country: CountryType,
    /** Sizing is the caller's concern — e.g. `cqw` units only make sense in a
        component that knows about the query container they're relative to. */
    w: ImageProps['w'];
    h: ImageProps['h'];
}

export const CountryFlag = ({ country, w, h }: Props) => {
    return (
        <Image
            w={w}
            h={h}
            src={`/api/footy/country/${country.fifaCode.toLowerCase()}/flag`}
            alt={country.name}
            title={country.name}
        />
    );
};
