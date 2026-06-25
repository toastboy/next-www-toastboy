declare module '*.mdx' {
    import type { MDXProps } from 'mdx/types';
    const MDXContent: (props: MDXProps) => import('react').JSX.Element;
    export default MDXContent;
}
