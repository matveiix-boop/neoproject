import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { getCurrentStep, routeStepOrder } from '@/entities/application/lib/application-flow';
import { useApplicationStore, useStoredApplication } from '@/entities/application/model/application-store';
import { ApplicationStepGuard } from '@/entities/application/ui/application-step-guard';
import { signDocuments } from '@/shared/api/bank-api';
import documentIcon from '@/shared/assets/images/document-icon.png';
import { Button } from '@/shared/ui/button/button';
import { Checkbox } from '@/shared/ui/checkbox/checkbox';
import { Container } from '@/shared/ui/container/container';
import { Loader } from '@/shared/ui/loader/loader';
import { StatusMessage } from '@/shared/ui/status-message/status-message';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';

import '@/pages/application-flow-page/application-flow-page.scss';
import './sign-page.scss';

const SIGN_DOCUMENT_TEXT =
  'Information on interest rates under bank deposit agreements with individuals. Center for Corporate Information Disclosure. Information of a professional participant in the securities market. Information about persons under whose control or significant influence the Partner Banks are. By leaving an application, you agree to the processing of personal data, obtaining information, obtaining access to a credit history, using an analogue of a handwritten signature, an offer, a policy regarding the processing of personal data, a form of consent to the processing of personal data.';

const SIGN_SUCCESS_TEXT =
  'Within 10 minutes you will be sent a PIN code to your email for confirmation';

const SignPageContent = () => {
  const { applicationId } = useParams();
  const id = Number(applicationId);
  const { updateApplication } = useApplicationStore();
  const application = useStoredApplication(id);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isPastSign = application
    ? routeStepOrder[getCurrentStep(application)] > routeStepOrder.sign || application.signSent
    : false;

  const handleSign = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await signDocuments(id);
      updateApplication(id, { signSent: true, status: 'DOCUMENT_SIGNED' });
    } catch (error) {
      console.error(error);
      setMessage('Failed to sign documents. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPastSign) {
    return (
      <StatusMessage
        title="Documents have been successfully signed and sent for approval"
        text={SIGN_SUCCESS_TEXT}
      />
    );
  }

  return (
    <main className="application-flow-page sign-page">
      <Container>
        <section className="sign-page__content" aria-labelledby="sign-title">
          <div className="application-flow-page__header sign-page__header">
            <h1 className="application-flow-page__title" id="sign-title">
              Signing of documents
            </h1>
            <span className="application-flow-page__step">Step 4 of 5</span>
          </div>

          <p className="sign-page__text">{SIGN_DOCUMENT_TEXT}</p>

          <a className="sign-page__document" href="/credit-card-offer.pdf" target="_blank" rel="noreferrer">
            <img className="sign-page__document-icon" src={documentIcon} alt="" aria-hidden="true" />
            <span>Information on your card</span>
          </a>

          <div className="sign-page__actions">
            <Checkbox
              id="document-sign-confirm"
              checked={isConfirmed}
              label="I agree"
              onChange={(event) => setIsConfirmed(event.target.checked)}
            />

            <Button
              className="sign-page__button"
              type="button"
              disabled={!isConfirmed || isLoading}
              onClick={handleSign}
            >
              {isLoading ? <Loader /> : 'Send'}
            </Button>
          </div>

          {message && <p className="sign-page__message">{message}</p>}
        </section>
      </Container>
    </main>
  );
};

export const SignPage = () => {
  return (
    <>
      <Header />
      <ApplicationStepGuard step="sign">
        <SignPageContent />
      </ApplicationStepGuard>
      <Footer />
    </>
  );
};
