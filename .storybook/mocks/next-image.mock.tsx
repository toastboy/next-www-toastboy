import * as React from 'react';

type NextImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
    src: string | { src: string };
};

const NextImage = React.forwardRef<HTMLImageElement, NextImageProps>(
    ({ src, alt = '', ...props }, ref) => {
        const resolvedSrc = typeof src === 'string' ? src : src.src;
        return <img ref={ref} src={resolvedSrc} alt={alt} {...props} />;
    },
);

NextImage.displayName = 'NextImageMock';

export default NextImage;
