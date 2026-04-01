import {themes as prismThemes} from 'prism-react-renderer';
import {createRequire} from 'node:module';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const require = createRequire(import.meta.url);
const {version: docsVersion} = require('./package.json') as {version: string};
const uiBaseUrl = (process.env.OTPKI_UI_BASE_URL ?? 'https://localhost:5173/ui').replace(/\/$/, '');
const apiDocsUrl = `${uiBaseUrl}/docs/api`;

const config: Config = {
  title: 'Omni Trust Public Key Infrastructure',
  tagline: 'OTPKI',
  favicon: 'img/omni-trust.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.example.com',
  baseUrl: '/',

  organizationName: 'OmniTrust',
  projectName: 'otpki',

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
              label: '0.0.2-dev',
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
          href: apiDocsUrl,
          label: 'API Reference',
          position: 'right',
        },
        {
          href: 'https://github.com/otpki-docs',
          label: 'Docs Repo',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `OTPKI • ${docsVersion} HASH:local • Copyright © ${new Date().getFullYear()} OmniTrust Security LLC. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
