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
const displayVersion = 'next';
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
    algolia: {
      // The application ID provided by Algolia
      appId: 'GXOGKO5A67',

      // Public API key (it is safe to commit it)
      apiKey: '90eafa10ac7f63845a78f6b364009af5',

      indexName: 'docs_otpki_com_gxogko5a67_pages',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
