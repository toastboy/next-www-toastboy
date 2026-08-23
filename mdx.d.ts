declare module '*.mdx' {
    import type { MDXProps } from 'mdx/types';
    import type { JSX } from 'react';

    const MDXContent: (props: MDXProps) => JSX.Element;
    export default MDXContent;
}
