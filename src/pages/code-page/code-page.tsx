import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useApplicationStore, useStoredApplication } from '@/entities/application/model/application-store';
import { ApplicationStepGuard } from '@/entities/application/ui/application-step-guard';
import { sendConfirmationCode } from '@/shared/api/bank-api';
import surpriseImage from '@/shared/assets/images/surprise-image.png';
import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';
import { Loader } from '@/shared/ui/loader/loader';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';

import '@/pages/application-flow-page/application-flow-page.scss';
import './code-page.scss';

const CODE_LENGTH = 4;
const EMPTY_CODE = Array.from({ length: CODE_LENGTH }, () => '');
const onlyDigits = (value: string) => value.replace(/\D/g, '');

const CodePageContent = () => {
  const { applicationId } = useParams();
  const id = Number(applicationId);
  const navigate = useNavigate();
  const { updateApplication, setCurrentApplication } = useApplicationStore();
  const application = useStoredApplication(id);
  const [codeDigits, setCodeDigits] = useState<string[]>(EMPTY_CODE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const lastSubmittedCode = useRef<string | null>(null);
  const isCompleted = application?.completed || application?.status === 'CREDIT_ISSUED';
  const code = codeDigits.join('');

  const goHome = () => {
    setCurrentApplication(null);
    navigate('/');
  };

  const submitCode = useCallback(
    async (confirmationCode: string) => {
      setError(null);
      lastSubmittedCode.current = confirmationCode;

      try {
        setIsLoading(true);
        await sendConfirmationCode(id, confirmationCode);
        updateApplication(id, { completed: true, status: 'CREDIT_ISSUED' });
      } catch (submitError) {
        console.error(submitError);
        setError('Invalid confirmation code');
      } finally {
        setIsLoading(false);
      }
    },
    [id, updateApplication],
  );

  useEffect(() => {
    if (code.length < CODE_LENGTH) {
      lastSubmittedCode.current = null;
      return;
    }

    if (!isCompleted && !isLoading && code !== lastSubmittedCode.current) {
      void submitCode(code);
    }
  }, [code, isCompleted, isLoading, submitCode]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const updateDigits = (startIndex: number, value: string) => {
    const digits = onlyDigits(value).slice(0, CODE_LENGTH - startIndex);

    if (!digits) {
      setCodeDigits((currentDigits) => {
        const nextDigits = [...currentDigits];
        nextDigits[startIndex] = '';
        return nextDigits;
      });
      setError(null);
      return;
    }

    setCodeDigits((currentDigits) => {
      const nextDigits = [...currentDigits];

      digits.split('').forEach((digit, digitIndex) => {
        nextDigits[startIndex + digitIndex] = digit;
      });

      return nextDigits;
    });

    setError(null);
    focusInput(Math.min(startIndex + digits.length, CODE_LENGTH - 1));
  };

  const handleDigitChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    updateDigits(index, event.target.value);
  };

  const handleDigitKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !codeDigits[index] && index > 0) {
      event.preventDefault();
      setCodeDigits((currentDigits) => {
        const nextDigits = [...currentDigits];
        nextDigits[index - 1] = '';
        return nextDigits;
      });
      setError(null);
      focusInput(index - 1);
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    updateDigits(index, event.clipboardData.getData('text'));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.length !== CODE_LENGTH) {
      setError('Invalid confirmation code');
      return;
    }

    if (!isLoading && code !== lastSubmittedCode.current) {
      void submitCode(code);
    }
  };

  if (isCompleted) {
    return (
      <main className="application-flow-page code-page code-page--success">
        <Container>
          <section className="code-page__success" aria-labelledby="code-success-title">
            <img className="code-page__success-image" src={surpriseImage} alt="" aria-hidden="true" />
            <h1 className="code-page__success-title" id="code-success-title">
              Congratulations! You have completed your new credit card.
            </h1>
            <p className="code-page__success-text">
              Your credit card will arrive soon. Thank you for choosing us!
            </p>
            <Button className="code-page__home-button" type="button" onClick={goHome}>
              View other offers of our bank
            </Button>
          </section>
        </Container>
      </main>
    );
  }

  return (
    <main className="application-flow-page code-page">
      <Container>
        <section className="code-page__card" aria-labelledby="code-title">
          <h1 className="code-page__title" id="code-title">
            Please enter confirmation code
          </h1>

          <form className="code-page__form" onSubmit={handleSubmit} noValidate>
            <div className="code-page__inputs" role="group" aria-label="Confirmation code">
              {codeDigits.map((digit, index) => (
                <input
                  className="code-page__input"
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={CODE_LENGTH}
                  aria-label={`Confirmation code digit ${index + 1}`}
                  value={digit}
                  placeholder="○"
                  disabled={isLoading}
                  onChange={handleDigitChange(index)}
                  onKeyDown={handleDigitKeyDown(index)}
                  onPaste={handlePaste(index)}
                />
              ))}
            </div>

            {error && <p className="code-page__error">{error}</p>}
            {isLoading && <Loader />}
          </form>
        </section>
      </Container>
    </main>
  );
};

export const CodePage = () => {
  return (
    <>
      <Header />
      <ApplicationStepGuard step="code">
        <CodePageContent />
      </ApplicationStepGuard>
      <Footer />
    </>
  );
};
