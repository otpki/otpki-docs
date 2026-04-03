import React from 'react';

type DocScreenshotProps = {
  alt: string;
  src: string;
  crop?: number | string;
  maxWidth?: string;
  bleed?: boolean;
  radius?: string;
};

export default function DocScreenshot({
  alt,
  src,
  crop = 18,
  maxWidth = '50rem',
  bleed = true,
  radius = '1rem',
}: DocScreenshotProps): React.JSX.Element {
  const cropSize = typeof crop === 'number' ? `${crop}px` : crop;
  const imageMargin = bleed ? `-${cropSize}` : '0';
  const imageWidth = bleed ? `calc(100% + (${cropSize} * 2))` : '100%';

  return (
    <div
      style={{
        border: '1px solid var(--ifm-toc-border-color)',
        borderRadius: radius,
        margin: '1.25rem 0 1.75rem 0.75rem',
        maxWidth,
        overflow: 'hidden',
      }}>
      <img
        alt={alt}
        src={src}
        style={{
          display: 'block',
          height: 'auto',
          margin: imageMargin,
          maxWidth: 'none',
          width: imageWidth,
        }}
      />
    </div>
  );
}
