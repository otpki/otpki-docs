import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Documentation</p>
          <Heading as="h1" className={styles.heroTitle}>
            <span className={styles.heroTitlePrimary}>OmniTrust PKI</span>
            <span className={styles.heroTitleSecondary}>
              An application for certificate issuance, enrollment, validation,
              and operational control.
            </span>
          </Heading>
          <p className={styles.heroSubtitle}>
            Use this site to learn about OTPKI, including its capabilities,
            deployment, and versioned API reference material.
          </p>
          <div className={styles.buttons}>
            <Link className={styles.primaryCta} to="/docs/intro">
              <span className={styles.primaryCtaTitle}>Introduction</span>
              <span className={styles.primaryCtaText}>
                Familiarize yourself with OTPKI and its capabilities
              </span>
            </Link>
            <Link className={styles.secondaryCta} to="/docs/getting-started">
              <span className={styles.secondaryCtaTitle}>Getting Started</span>
              <span className={styles.secondaryCtaText}>
                Learn how to deploy OTPKI and create a simple certificate authority
              </span>
            </Link>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <p className={styles.panelLabel}>Included in this site</p>
          <ul className={styles.panelList}>
            <li>Overview content for administrators, operators, and integrators</li>
            <li>Versioned documentation snapshots aligned to pinned OTPKI revisions</li>
            <li>Generated OpenAPI documentation published with the docs build</li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="OTPKI product documentation covering orientation, operations, and versioned API reference material.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
