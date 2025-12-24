import * as React from 'react';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, ...props }, ref) => (
    <a href={href} ref={ref} {...props} />
));

Link.displayName = 'NextLinkMock';

export default Link;
