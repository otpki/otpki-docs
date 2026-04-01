import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
import {
  ErrorCauseBoundary,
  ThemeClassNames,
  useThemeConfig,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarSearch from '@theme/Navbar/Search';
import SearchBar from '@theme/SearchBar';

import styles from './styles.module.css';

function useNavbarItems() {
  return useThemeConfig().navbar.items;
}

function NavbarItems({
  items,
}: {
  items: typeof useThemeConfig extends () => infer T
    ? T extends {navbar: {items: infer I}}
      ? I
      : never
    : never;
}) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function ActiveDocTitle() {
  const {pathname} = useLocation();
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    if (!pathname.startsWith('/docs')) {
      setPageTitle('');
      return;
    }

    const readTitle = () => {
      const fullTitle = document.title ?? '';
      const fromDocumentTitle = fullTitle.split(' | ')[0]?.trim() ?? '';
      const fromBreadcrumb =
        document
          .querySelector('main .breadcrumbs__item--active .breadcrumbs__link')
          ?.textContent?.trim() ?? '';

      const nextTitle =
        fromDocumentTitle &&
        fromDocumentTitle !== 'Omni Trust Public Key Infrastructure'
          ? fromDocumentTitle
          : fromBreadcrumb;

      setPageTitle(nextTitle);
    };

    readTitle();

    const frame = window.requestAnimationFrame(readTitle);
    const timeout = window.setTimeout(readTitle, 50);
    const titleNode = document.querySelector('title');
    const observer =
      titleNode &&
      new MutationObserver(() => {
        readTitle();
      });

    if (observer && titleNode) {
      observer.observe(titleNode, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, [pathname]);

  if (!pageTitle || pageTitle === 'Omni Trust Public Key Infrastructure') {
    return null;
  }

  return <div className={styles.activeDocTitle}>{pageTitle}</div>;
}

function NavbarContentLayout({
  left,
  center,
  right,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          'navbar__items',
        )}>
        {left}
      </div>
      <div className={clsx('navbar__items', styles.navbarCenter)}>{center}</div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right',
        )}>
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item) => item.type === 'search');

  return (
    <NavbarContentLayout
      left={
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          <NavbarItems items={leftItems} />
        </>
      }
      center={<ActiveDocTitle />}
      right={
        <>
          <NavbarItems items={rightItems} />
          <NavbarColorModeToggle className={styles.colorModeToggle} />
          {!searchBarItem && (
            <NavbarSearch>
              <SearchBar />
            </NavbarSearch>
          )}
        </>
      }
    />
  );
}
