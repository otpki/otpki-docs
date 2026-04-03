import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';

import styles from './styles.module.css';

export default function ApiReferenceEmbed(): React.JSX.Element {
  const docsVersion = useDocsVersion();
  const specRoot = useBaseUrl(`/openapi/${docsVersion.version}`);
  const src = useBaseUrl(
    `/api-reference/?specRoot=${encodeURIComponent(specRoot.replace(/\/$/, ''))}`,
  );

  return (
    <div className={styles.frameShell}>
      <iframe
        className={styles.frame}
        src={src}
        title="OTPKI API Reference"
        loading="lazy"
        referrerPolicy="same-origin"
      />
    </div>
  );
}
