import emailIcon from '@/shared/assets/images/email.svg';
import sendIcon from '@/shared/assets/images/send.svg';
import { Container } from '@/shared/ui/container/container';

import './subscribe.scss';

export const Subscribe = () => {
  return (
    <section className="subscribe">
      <Container className="subscribe__container">
        <p className="subscribe__label">Support</p>
        <h2 className="subscribe__title">Subscribe Newsletter &amp; get</h2>
        <p className="subscribe__subtitle">Bank News</p>

        <form className="subscribe__form" onSubmit={(event) => event.preventDefault()}>
          <label className="subscribe__field">
            <img className="subscribe__field-icon" src={emailIcon} alt="" aria-hidden="true" />
            <input className="subscribe__input" type="email" placeholder="Your email" />
          </label>

          <button className="subscribe__button" type="submit">
            <img className="subscribe__button-icon" src={sendIcon} alt="" aria-hidden="true" />
            <span className="subscribe__button-text">Subscribe</span>
          </button>
        </form>
      </Container>
    </section>
  );
};
