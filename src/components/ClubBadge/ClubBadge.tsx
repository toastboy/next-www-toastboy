import { Image, type ImageProps } from '@mantine/core';
import type { ClubType } from 'prisma/zod/schemas/models/Club.schema';

export interface Props {
    club: ClubType;
    /** Sizing is the caller's concern — e.g. `cqw` units only make sense in a
        component that knows about the query container they're relative to. */
    w: ImageProps['w'];
    h: ImageProps['h'];
}
export const ClubBadge = ({ club, w, h }: Props) => {
    return (
        <Image
            w={w}
            h={h}
            src={`/api/footy/club/${club.id}/badge`}
            alt={club.clubName}
            title={club.clubName}
        />
    );
};
