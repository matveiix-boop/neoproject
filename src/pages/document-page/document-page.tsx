import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getCurrentStep, isApplicationDenied, routeStepOrder } from '@/entities/application/lib/application-flow';
import { useApplicationStore, useStoredApplication } from '@/entities/application/model/application-store';
import { ApplicationStepGuard } from '@/entities/application/ui/application-step-guard';
import { ApplicationDeniedMessage } from '@/entities/application/ui/application-denied-message';
import {
  denyApplication,
  sendDocuments,
  type PaymentScheduleItem,
} from '@/shared/api/bank-api';
import { Button } from '@/shared/ui/button/button';
import { Checkbox } from '@/shared/ui/checkbox/checkbox';
import { Container } from '@/shared/ui/container/container';
import { Loader } from '@/shared/ui/loader/loader';
import { StatusMessage } from '@/shared/ui/status-message/status-message';
import { Table, type TableColumn } from '@/shared/ui/table/table';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';

import '@/pages/application-flow-page/application-flow-page.scss';
import './document-page.scss';

const formatMoney = (value: number) => `${Number(value || 0).toLocaleString('ru-RU')} ₽`;

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('ru-RU');
};

const getPaymentSchedule = (application: ReturnType<typeof useStoredApplication>) => {
  return application?.admin?.credit?.paymentSchedule || application?.admin?.paymentSchedule || [];
};

const DenyModal = ({
  applicationId,
  onClose,
}: {
  applicationId: number;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { updateApplication, setCurrentApplication } = useApplicationStore();
  const [isDenied, setIsDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goHome = () => {
    setCurrentApplication(null);
    navigate('/');
  };

  const handleClose = () => {
    if (isDenied) {
      goHome();
      return;
    }

    onClose();
  };

  const handleDeny = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await denyApplication(applicationId);
      updateApplication(applicationId, { denied: true, status: 'CLIENT_DENIED' });
      setIsDenied(true);
    } catch (denyError) {
      console.error(denyError);
      setError('Failed to deny application. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="deny-modal-title">
      <div className="modal__content">
        <button className="modal__close" type="button" aria-label="Close" onClick={handleClose}>
          ×
        </button>

        {!isDenied ? (
          <>
            <h2 className="modal__title" id="deny-modal-title">
              Deny application
            </h2>
            <p className="modal__text">You exactly sure, you want to cancel this application?</p>
            {error && <p className="modal__error">{error}</p>}
            <div className="modal__actions">
              <Button className="modal__button modal__button--danger" type="button" onClick={handleDeny} disabled={isLoading}>
                {isLoading ? <Loader /> : 'Deny'}
              </Button>
              <Button className="modal__button" type="button" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="modal__title" id="deny-modal-title">
              Deny application
            </h2>
            <p className="modal__text">Your application has been deny!</p>
            <div className="modal__actions">
              <Button className="modal__button" type="button" onClick={goHome}>
                Go home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DocumentPageContent = () => {
  const { applicationId } = useParams();
  const id = Number(applicationId);
  const { refreshApplication, updateApplication } = useApplicationStore();
  const application = useStoredApplication(id);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    refreshApplication(id)
      .catch((error) => console.error(error))
      .finally(() => setIsRefreshing(false));
  }, [id, refreshApplication]);

  const isDenied = isApplicationDenied(application);
  const schedule = getPaymentSchedule(application);
  const isPastDocument = application
    ? routeStepOrder[getCurrentStep(application)] > routeStepOrder.document || application.documentsSent
    : false;

  const columns: TableColumn<PaymentScheduleItem>[] = useMemo(
    () => [
      {
        key: 'number',
        title: 'Number',
        render: (item) => item.number,
        getSortValue: (item) => item.number,
      },
      {
        key: 'date',
        title: 'Date',
        render: (item) => formatDate(item.date),
        getSortValue: (item) => new Date(item.date),
      },
      {
        key: 'totalPayment',
        title: 'Total payment',
        render: (item) => formatMoney(item.totalPayment),
        getSortValue: (item) => item.totalPayment,
      },
      {
        key: 'interestPayment',
        title: 'Interest payment',
        render: (item) => formatMoney(item.interestPayment),
        getSortValue: (item) => item.interestPayment,
      },
      {
        key: 'debtPayment',
        title: 'Debt payment',
        render: (item) => formatMoney(item.debtPayment),
        getSortValue: (item) => item.debtPayment,
      },
      {
        key: 'remainingDebt',
        title: 'Remaining debt',
        render: (item) => formatMoney(item.remainingDebt),
        getSortValue: (item) => item.remainingDebt,
      },
    ],
    [],
  );

  const handleSend = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await sendDocuments(id);
      updateApplication(id, { documentsSent: true, status: 'DOCUMENT_CREATED' });
      setMessage('Documents are formed. You will receive a link to sign documents by email.');
    } catch (error) {
      console.error(error);
      setMessage('Failed to send documents. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isDenied && !isModalOpen) {
    return <ApplicationDeniedMessage />;
  }

  if (isPastDocument) {
    return (
      <StatusMessage
        title="Documents are formed"
        text="Documents for signing have been sent to your email."
      />
    );
  }

  return (
    <main className="application-flow-page document-page">
      <Container>
        <section className="application-flow-page__card" aria-labelledby="document-title">
          <div className="application-flow-page__header document-page__header">
            <h1 className="application-flow-page__title" id="document-title">
              Payment Schedule
            </h1>
            <span className="application-flow-page__step">Step 3 of 5</span>
          </div>

          {isRefreshing ? (
            <div className="document-page__loading">Loading payment schedule...</div>
          ) : schedule.length ? (
            <Table columns={columns} data={schedule} getRowKey={(item) => item.number} />
          ) : (
            <p className="document-page__empty">Payment schedule is not available yet.</p>
          )}

          <div className="document-page__actions">
            <Button className="document-page__deny" type="button" variant="ghost" onClick={() => setIsModalOpen(true)}>
              Deny
            </Button>

            <div className="document-page__confirm">
              <Checkbox
                id="schedule-confirm"
                checked={isAgreed}
                label="I agree with the payment schedule"
                onChange={(event) => setIsAgreed(event.target.checked)}
              />
              <Button
                className="document-page__send"
                type="button"
                disabled={!isAgreed || isLoading}
                onClick={handleSend}
              >
                {isLoading ? <Loader /> : 'Send'}
              </Button>
            </div>
          </div>

          {message && <p className="document-page__message">{message}</p>}
        </section>
      </Container>

      {isModalOpen && <DenyModal applicationId={id} onClose={() => setIsModalOpen(false)} />}
    </main>
  );
};

export const DocumentPage = () => {
  return (
    <>
      <Header />
      <ApplicationStepGuard step="document">
        <DocumentPageContent />
      </ApplicationStepGuard>
      <Footer />
    </>
  );
};
