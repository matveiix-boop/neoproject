import footerLogo from '@/shared/assets/images/footer-logo.png';
import { Container } from '@/shared/ui/container/container';
import { footerLinks } from '@/shared/data/content';

import './footer.scss';

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__top">
          <img className="footer__logo" src={footerLogo} alt="NeoFlex" />

          <address className="footer__contacts">
            <a className="footer__phone" href="tel:+74959842513">
              +7 (495) 984 25 13
            </a>
            <a className="footer__email" href="mailto:info@neoFlex.ru">
              info@neoflex.ru
            </a>
          </address>
        </div>

        <nav className="footer__navigation" aria-label="Footer navigation">
          <ul className="footer__navigation-list">
            {footerLinks.map((link) => (
              <li className="footer__navigation-item" key={link}>
                <a className="footer__navigation-link" href="#">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="footer__compliance" href="#">
          Compliance and business ethics
        </a>

        <p className="footer__note">
          We use cookies to personalize our services and improve the user experience of our website. Cookies are
          small files containing information about previous visits to a website. If you do not want to use
          cookies, please change your browser settings.
        </p>
      </Container>
    </footer>
  );
};
