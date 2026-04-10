import { Container } from '@/shared/ui/container/container';
import { Button } from '@/shared/ui/button/button';
import { navigationItems } from '@/shared/data/content';

import './header.scss';

export const Header = () => {
  return (
    <header className="header">
      <Container className="header__container">
        <a className="header__logo" href="#hero" aria-label="NeoBank home page">
          <span>NeoBank </span>
        </a>

        <nav className="header__navigation" aria-label="Main navigation">
          <ul className="header__navigation-list">
            {navigationItems.map((item) => (
              <li className="header__navigation-item" key={item.label}>
                <a className="header__navigation-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button className="header__button" type="button">
          Online Bank
        </Button>
      </Container>
    </header>
  );
};
