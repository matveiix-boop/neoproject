import { FormEvent, useEffect, useState } from 'react';

import { subscribeToNewsletter } from '@/shared/api/bank-api';
import emailIcon from '@/shared/assets/images/email.svg';
import sendIcon from '@/shared/assets/images/send.svg';
import { Container } from '@/shared/ui/container/container';

import './subscribe.scss';

const SUBSCRIPTION_STORAGE_KEY = 'neobank_newsletter_subscribed';
const SUBSCRIBED_TEXT = "You are already subscribed to the bank's newsletter";

export const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSubscribed(localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) === 'true');
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      await subscribeToNewsletter(email.trim());
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'true');
      setIsSubscribed(true);
    } catch (submitError) {
      console.error(submitError);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="subscribe">
      <Container className="subscribe__container">
        <p className="subscribe__label">Support</p>
        <h2 className="subscribe__title">Subscribe Newsletter &amp; get</h2>
        <p className="subscribe__subtitle">Bank News</p>

        {isSubscribed ? (
          <p className="subscribe__success">{SUBSCRIBED_TEXT}</p>
        ) : (
          <form className="subscribe__form" onSubmit={handleSubmit}>
            <label className="subscribe__field">
              <img className="subscribe__field-icon" src={emailIcon} alt="" aria-hidden="true" />
              <input
                className="subscribe__input"
                type="email"
                placeholder="Your email"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value.trimEnd())}
              />
            </label>

            <button className="subscribe__button" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="subscribe__loader" aria-label="Loading" />
              ) : (
                <>
                  <img className="subscribe__button-icon" src={sendIcon} alt="" aria-hidden="true" />
                  <span className="subscribe__button-text">Subscribe</span>
                </>
              )}
            </button>
          </form>
        )}

        {error && <p className="subscribe__error">{error}</p>}
      </Container>
    </section>
  );
};
