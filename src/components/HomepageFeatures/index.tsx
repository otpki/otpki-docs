import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  href: string;
  linkLabel: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Get to Know OTPKI',
    href: '/docs/intro',
    linkLabel: 'Go to Introduction',
    description: (
      <>
        Start with a high-level look at OTPKI, what it can do, and how the
        major parts of the platform work together.
      </>
    ),
  },
  {
    title: 'Set Up Your First Environment',
    href: '/docs/getting-started',
    linkLabel: 'Open Getting Started',
    description: (
      <>
        Follow the getting started path for deployment basics, initial setup,
        and a first certificate authority or issuance workflow in OTPKI.
      </>
    ),
  },
  {
    title: 'Operations',
    href: '/docs/operations',
    linkLabel: 'Open Operations',
    description: (
      <>
        Learn how to use OTPKI day to day, including routine administration,
        certificate workflows, and common operational tasks.
      </>
    ),
  },
  {
    title: 'Integration',
    href: '/docs/integration',
    linkLabel: 'Open Integration',
    description: (
      <>
        Learn how OTPKI connects with external systems, automation, and API-driven workflows.
      </>
    ),
  },
  {
    title: 'Guides',
    href: '/docs/guides',
    linkLabel: 'Open Guides',
    description: (
      <>
        Follow step-by-step helper content for common OTPKI scenarios and repeatable setup patterns.
      </>
    ),
  },
  {
    title: 'Troubleshooting',
    href: '/docs/troubleshooting',
    linkLabel: 'Open Troubleshooting',
    description: (
      <>
        Find starting points for diagnosing deployment issues, workflow failures, and operational problems.
      </>
    ),
  },
  {
    title: 'References',
    href: '/docs/reference',
    linkLabel: 'Open References',
    description: (
      <>
        Browse technical reference material, including OTPKI API documentation.
      </>
    ),
  },
];

function Feature({title, href, linkLabel, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureColumn)}>
      <div className={styles.featureCard}>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p>{description}</p>
        <Link className={styles.featureLink} to={href}>
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
