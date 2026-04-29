import { useLocation } from 'react-router-dom';

import { Container } from '@/shared/ui/container/container';
import { Button } from '@/shared/ui/button/button';
import { navigationItems } from '@/shared/data/content';

import './header.scss';

export const Header = () => {
  const { pathname } = useLocation();

  const getNavigationLinkClassName = (href: string) => {
    const isActive = href === '/loan' && pathname === '/loan';

    return `header__navigation-link${isActive ? ' header__navigation-link--active' : ''}`;
  };

  return (
    <header className="header">
      <Container className="header__container">
        <a className="header__logo" href="/" aria-label="NeoBank home page">
          <span>NeoBank </span>
        </a>

        <nav className="header__navigation" aria-label="Main navigation">
          <ul className="header__navigation-list">
            {navigationItems.map((item) => {
              const isCreditCardActive = item.href === '/loan' && pathname === '/loan';

              return (
                <li className="header__navigation-item" key={item.label}>
                  <a
                    className={getNavigationLinkClassName(item.href)}
                    href={item.href}
                    aria-current={isCreditCardActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <Button className="header__button" type="button">
          Online Bank
        </Button>
      </Container>
    </header>
  );
};
