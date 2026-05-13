import {themes as prismThemes} from 'prism-react-renderer';
import {createRequire} from 'node:module';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const require = createRequire(import.meta.url);
const {execSync} = require('node:child_process') as typeof import('node:child_process');
const protobufHash = execSync('git -C external/otpki-protobuf rev-parse --short HEAD', {
  cwd: __dirname,
  encoding: 'utf8',
}).trim();
const displayVersion = '0.0.2-dev';
const baseUrl = '/';

const config: Config = {
  title: 'OmniTrust Public Key Infrastructure',
  tagline: 'OTPKI',
  favicon: 'img/omni-trust.ico',

  future: {
    v4: true,
  },

  // GitHub Pages requirements.  Do not change without consulting
  // https://docusaurus.io/docs/deployment#docusaurusconfigjs-settings
  url: 'https://docs.otpki.com', // initially just check to make sure github.io page works
  baseUrl: baseUrl,
  organizationName: 'otpki',
  projectName: 'otpki-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: true,
  // end GitHub Pages

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          lastVersion: 'current',
          versions: {
            current: {
              label: displayVersion,
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'OTPKI Logo',
        src: 'img/OTPKI-color.svg',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          to: '/docs/reference/api-documentation',
          label: 'API Documentation',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value:
            `<a class="navbar__item ot-website-link" href="https://omnitrust.com/" target="_blank" rel="noreferrer" aria-label="OmniTrust website"><img class="ot-website-logo" src="${baseUrl}img/ot-logo-color.svg" alt="OmniTrust" /></a>`,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `OTPKI • ${displayVersion} HASH:${protobufHash} • Copyright © ${new Date().getFullYear()} OmniTrust Security LLC. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
