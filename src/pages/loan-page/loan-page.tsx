import { ChangeEvent, FormEvent, useMemo, useState, type CSSProperties } from 'react';

import { sendPrescoringApplication, type PrescoringApplication } from '@/shared/api/bank-api';
import { Accordion, type AccordionItem } from '@/shared/ui/accordion/accordion';
import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';
import { Divider } from '@/shared/ui/divider/divider';
import { Input } from '@/shared/ui/input/input';
import { Label } from '@/shared/ui/label/label';
import { Select } from '@/shared/ui/select/select';
import { Tabs } from '@/shared/ui/tabs/tabs';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import bagIcon from '@/shared/assets/images/bag_duotone.svg';
import calendarIcon from '@/shared/assets/images/calendar_duotone.svg';
import clockIcon from '@/shared/assets/images/clock_duotone.svg';
import creditCardIcon from '@/shared/assets/images/credit_card_duotone.svg';
import moneyIcon from '@/shared/assets/images/money_duotone.svg';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';

import './loan-page.scss';

type TabId = 'about' | 'rates' | 'cashback' | 'faq';

type FormValues = {
  amount: string;
  term: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  birthdate: string;
  passportSeries: string;
  passportNumber: string;
};

type FormFieldName = keyof FormValues;
type FieldErrors = Partial<Record<FormFieldName, string>>;

const MIN_AMOUNT = 150000;
const MAX_AMOUNT = 600000;
const AMOUNT_STEP = 10000;

const tabs = [
  { id: 'about', label: 'About card' },
  { id: 'rates', label: 'Rates and conditions' },
  { id: 'cashback', label: 'Cashback' },
  { id: 'faq', label: 'FAQ' },
];

const aboutCards = [
  {
    icon: moneyIcon,
    title: 'Up to 50 000 ₽',
    text: 'Cash and transfers without commission and percent',
    accent: false,
  },
  {
    icon: calendarIcon,
    title: 'Up to 160 days',
    text: 'Without percent on the loan',
    accent: true,
  },
  {
    icon: clockIcon,
    title: 'Free delivery',
    text: 'We will deliver your card by courier at a convenient place and time for you',
    accent: false,
  },
  {
    icon: bagIcon,
    title: 'Up to 12 months',
    text: 'No percent. For equipment, clothes and other purchases in installments',
    accent: true,
  },
  {
    icon: creditCardIcon,
    title: 'Convenient deposit and withdrawal',
    text: 'At any ATM. Top up your credit card for free with cash or transfer from other cards',
    accent: false,
  },
];

const rates = [
  { name: 'Card currency', value: 'Rubles, dollars, euro' },
  { name: 'Interest free period', value: '0% up to 160 days' },
  { name: 'Payment system', value: 'Mastercard, Visa' },
  { name: 'Maximum credit limit on the card', value: '600 000 ₽' },
  {
    name: 'Replenishment and withdrawal',
    value: 'At any ATM. Top up your credit card for free with cash or transfer from other cards',
  },
  { name: 'Max cashback per month', value: '15 000 ₽' },
  {
    name: 'Transaction Alert',
    value: '60 ₽ — SMS or push notifications\n0 ₽ — card statement, information about transactions in the online bank',
  },
];

const cashbackCards = [
  { title: 'For food delivery, cafes and restaurants', value: '5%', accent: false },
  { title: 'In supermarkets with our subscription', value: '5%', accent: true },
  { title: "In clothing stores and children's goods", value: '2%', accent: false },
  { title: 'Other purchases and payment of services and fines', value: '1%', accent: true },
  { title: 'Shopping in online stores', value: 'up to 3%', accent: false },
  { title: 'Purchases from our partners', value: '30%', accent: true },
];

const issuingFaq: AccordionItem[] = [
  {
    id: 'issuing-1',
    title: 'How to get a card?',
    content:
      'We will deliver your card by courier free of charge. Delivery in Moscow and St. Petersburg - 1-2 working days. For other regions of the Russian Federation - 2-5 working days.',
  },
  {
    id: 'issuing-2',
    title: 'What documents are needed and how old should one be to get a card?',
    content: 'Need a passport. You must be between 20 and 70 years old.',
  },
  {
    id: 'issuing-3',
    title: 'In what currency can I issue a card?',
    content: 'In rubles, dollars or euro',
  },
  {
    id: 'issuing-4',
    title: 'How much income do I need to get a credit card?',
    content:
      'To obtain a credit card, you will need an income of at least 25,000 rubles per month after taxes.',
  },
  {
    id: 'issuing-5',
    title: "How do I find out about the bank's decision on my application?",
    content: 'After registration, you will receive an e-mail with a decision on your application.',
  },
];

const usingFaq: AccordionItem[] = [
  {
    id: 'using-1',
    title: 'What is an interest free credit card?',
    content:
      'A credit card with a grace period is a bank card with an established credit limit, designed for payment, reservation of goods and services, as well as for receiving cash, which allows you to use credit funds free of charge for a certain period.',
  },
  {
    id: 'using-2',
    title: 'How to activate a credit card',
    content:
      'You can activate your credit card and generate a PIN code immediately after receiving the card at a bank branch using a PIN pad.',
  },
  {
    id: 'using-3',
    title: 'What is a settlement date?',
    content:
      'The settlement date is the date from which you can pay off the debt for the reporting period. The settlement date falls on the first calendar day following the last day of the reporting period.',
  },
  {
    id: 'using-4',
    title: 'What do I need to know about interest rates?',
    content:
      'For each reporting period from the 7th day of the previous month to the 6th day of the current month inclusive, a statement is generated for the credit card.',
  },
];

const processSteps = [
  'Fill out an online application - you do not need to visit the bank',
  "Find out the bank's decision immediately after filling out the application",
  'The bank will deliver the card free of charge, wherever convenient, to your city',
];

const initialValues: FormValues = {
  amount: String(MIN_AMOUNT),
  term: '6',
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  birthdate: '',
  passportSeries: '',
  passportNumber: '',
};

const termOptions = [
  { value: '6', label: '6 month' },
  { value: '12', label: '12 month' },
  { value: '18', label: '18 month' },
  { value: '24', label: '24 month' },
];

const latinNameRegex = /^[A-Za-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatAmount = (value: string | number) => {
  return Number(value).toLocaleString('ru-RU');
};

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const parseBirthdate = (value: string): Date | null => {
  const trimmedValue = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);
  const displayMatch = /^(\d{2})[.-](\d{2})[.-](\d{4})$/.exec(trimmedValue);

  const [, year, month, day] = isoMatch || [];
  const [, displayDay, displayMonth, displayYear] = displayMatch || [];

  const dateYear = isoMatch ? Number(year) : Number(displayYear);
  const dateMonth = isoMatch ? Number(month) : Number(displayMonth);
  const dateDay = isoMatch ? Number(day) : Number(displayDay);

  if (!dateYear || !dateMonth || !dateDay) {
    return null;
  }

  const date = new Date(dateYear, dateMonth - 1, dateDay);

  if (
    date.getFullYear() !== dateYear ||
    date.getMonth() !== dateMonth - 1 ||
    date.getDate() !== dateDay
  ) {
    return null;
  }

  return date;
};

const isAdult = (date: Date) => {
  const today = new Date();
  const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  return date <= adultDate;
};

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const validateValues = (values: FormValues): FieldErrors => {
  const errors: FieldErrors = {};
  const amount = Number(values.amount);

  if (!values.amount || Number.isNaN(amount)) {
    errors.amount = 'Enter amount';
  } else if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    errors.amount = `Amount must be from ${formatAmount(MIN_AMOUNT)} to ${formatAmount(MAX_AMOUNT)}`;
  }

  if (values.lastName.trim().length < 2) {
    errors.lastName = 'Enter your last name';
  } else if (!latinNameRegex.test(values.lastName.trim())) {
    errors.lastName = 'Use latin letters only';
  }

  if (values.firstName.trim().length < 2) {
    errors.firstName = 'Enter your first name';
  } else if (!latinNameRegex.test(values.firstName.trim())) {
    errors.firstName = 'Use latin letters only';
  }

  if (values.middleName.trim() && !latinNameRegex.test(values.middleName.trim())) {
    errors.middleName = 'Use latin letters only';
  }

  if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Incorrect email address';
  }

  const birthdate = parseBirthdate(values.birthdate);

  if (!birthdate) {
    errors.birthdate = 'Incorrect date of birth';
  } else if (!isAdult(birthdate)) {
    errors.birthdate = 'You must be at least 18 years old';
  }

  if (!/^\d{4}$/.test(values.passportSeries)) {
    errors.passportSeries = 'The series must be 4 digits';
  }

  if (!/^\d{6}$/.test(values.passportNumber)) {
    errors.passportNumber = 'The series must be 6 digits';
  }

  return errors;
};

const hasVisibleValue = (name: FormFieldName, values: FormValues) => {
  if (name === 'middleName') {
    return values.middleName.trim().length > 0;
  }

  return String(values[name]).trim().length > 0;
};

const PrescoringForm = () => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FormFieldName, boolean>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const errors = useMemo(() => validateValues(values), [values]);
  const amountNumber = Math.min(
    Math.max(Number(values.amount) || MIN_AMOUNT, MIN_AMOUNT),
    MAX_AMOUNT,
  );
  const amountProgress = ((amountNumber - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;
  const rangeStyle = {
    '--range-progress': `${amountProgress}%`,
  } as CSSProperties;

  const getFieldStatus = (name: FormFieldName) => {
    const isVisible = Boolean(touched[name] || isSubmitted);
    const hasError = Boolean(errors[name]);

    return {
      isInvalid: isVisible && hasError,
      isValid: isVisible && !hasError && hasVisibleValue(name, values),
      error: errors[name],
    };
  };

  const setFieldValue = (name: FormFieldName, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setFormMessage(null);
  };

  const handleTextChange = (name: FormFieldName) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimEnd();
    setFieldValue(name, value);
  };

  const handleDigitsChange =
    (name: 'passportSeries' | 'passportNumber', maxLength: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(name, onlyDigits(event.target.value).slice(0, maxLength));
    };

  const handleAmountInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('amount', onlyDigits(event.target.value));
  };

  const handleAmountBlur = () => {
    const amount = Number(values.amount);
    const nextAmount = !values.amount || Number.isNaN(amount)
      ? MIN_AMOUNT
      : Math.min(Math.max(amount, MIN_AMOUNT), MAX_AMOUNT);

    setFieldValue('amount', String(nextAmount));
    setTouched((currentTouched) => ({ ...currentTouched, amount: true }));
  };

  const handleBlur = (name: FormFieldName) => () => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: String(currentValues[name]).trim(),
    }));
    setTouched((currentTouched) => ({ ...currentTouched, [name]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setFormMessage(null);

    const trimmedValues: FormValues = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      middleName: values.middleName.trim(),
      email: values.email.trim(),
      birthdate: values.birthdate.trim(),
    };
    const nextErrors = validateValues(trimmedValues);

    setValues(trimmedValues);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const birthdate = parseBirthdate(trimmedValues.birthdate);

    if (!birthdate) {
      return;
    }

    const payload: PrescoringApplication = {
      amount: Number(trimmedValues.amount),
      term: Number(trimmedValues.term),
      firstName: trimmedValues.firstName,
      lastName: trimmedValues.lastName,
      middleName: trimmedValues.middleName || null,
      email: trimmedValues.email,
      birthdate: formatDateForApi(birthdate),
      passportSeries: trimmedValues.passportSeries,
      passportNumber: trimmedValues.passportNumber,
    };

    try {
      setIsLoading(true);
      await sendPrescoringApplication(payload);
      setFormMessage('Your application has been sent successfully');
    } catch (error) {
      console.error(error);
      setFormMessage('Failed to send application. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="prescoring" id="prescoring" onSubmit={handleSubmit} noValidate>
      <div className="prescoring__top">
        <div className="prescoring__title-wrap">
          <h2 className="prescoring__title">Customize your card</h2>
          <span className="prescoring__step">Step 1 of 5</span>
        </div>

        <div className="prescoring__amount-card">
          <Label htmlFor="amount">Select amount</Label>
          <Input
            id="amount"
            className="prescoring__amount-input"
            type="number"
            inputMode="numeric"
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            value={values.amount}
            error={getFieldStatus('amount').error}
            isInvalid={getFieldStatus('amount').isInvalid}
            isValid={getFieldStatus('amount').isValid}
            onChange={handleAmountInputChange}
            onBlur={handleAmountBlur}
          />
          <input
            className="prescoring__range"
            type="range"
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={AMOUNT_STEP}
            value={values.amount || MIN_AMOUNT}
            style={rangeStyle}
            onChange={(event) => setFieldValue('amount', event.target.value)}
            aria-label="Select amount"
          />
          <div className="prescoring__limits">
            <span>{formatAmount(MIN_AMOUNT)}</span>
            <span>{formatAmount(MAX_AMOUNT)}</span>
          </div>
        </div>
      </div>

      <div className="prescoring__summary" aria-live="polite">
        <h3 className="prescoring__summary-title">You have chosen the amount</h3>
        <p className="prescoring__summary-amount">{formatAmount(values.amount || MIN_AMOUNT)} ₽</p>
        <Divider />
      </div>

      <section className="prescoring__contacts" aria-label="Contact information">
        <h3 className="prescoring__contacts-title">Contact Information</h3>

        <div className="prescoring__grid">
          <div className="prescoring__field">
            <Label htmlFor="lastName" required>
              Your last name
            </Label>
            <Input
              id="lastName"
              value={values.lastName}
              placeholder="For Example Doe"
              autoComplete="family-name"
              error={getFieldStatus('lastName').error}
              isInvalid={getFieldStatus('lastName').isInvalid}
              isValid={getFieldStatus('lastName').isValid}
              onChange={handleTextChange('lastName')}
              onBlur={handleBlur('lastName')}
            />
          </div>

          <div className="prescoring__field">
            <Label htmlFor="firstName" required>
              Your first name
            </Label>
            <Input
              id="firstName"
              value={values.firstName}
              placeholder="For Example Jhon"
              autoComplete="given-name"
              error={getFieldStatus('firstName').error}
              isInvalid={getFieldStatus('firstName').isInvalid}
              isValid={getFieldStatus('firstName').isValid}
              onChange={handleTextChange('firstName')}
              onBlur={handleBlur('firstName')}
            />
          </div>

          <div className="prescoring__field">
            <Label htmlFor="middleName">Your patronymic</Label>
            <Input
              id="middleName"
              value={values.middleName}
              placeholder="For Example Victorovich"
              error={getFieldStatus('middleName').error}
              isInvalid={getFieldStatus('middleName').isInvalid}
              isValid={getFieldStatus('middleName').isValid}
              onChange={handleTextChange('middleName')}
              onBlur={handleBlur('middleName')}
            />
          </div>

          <div className="prescoring__field">
            <Label htmlFor="term" required>
              Select term
            </Label>
            <Select
              id="term"
              options={termOptions}
              value={values.term}
              onChange={(event) => setFieldValue('term', event.target.value)}
            />
          </div>

          <div className="prescoring__field">
            <Label htmlFor="email" required>
              Your email
            </Label>
            <Input
              id="email"
              value={values.email}
              type="email"
              placeholder="test@gmail.com"
              autoComplete="email"
              error={getFieldStatus('email').error}
              isInvalid={getFieldStatus('email').isInvalid}
              isValid={getFieldStatus('email').isValid}
              onChange={handleTextChange('email')}
              onBlur={handleBlur('email')}
            />
          </div>

          <div className="prescoring__field">
            <Label htmlFor="birthdate" required>
              Your date of birth
            </Label>
            <Input
              id="birthdate"
              value={values.birthdate}
              placeholder="Select Date and Time"
              error={getFieldStatus('birthdate').error}
              isInvalid={getFieldStatus('birthdate').isInvalid}
              isValid={getFieldStatus('birthdate').isValid}
              onChange={handleTextChange('birthdate')}
              onBlur={handleBlur('birthdate')}
            />
          </div>

          <div className="prescoring__field">
            <Label htmlFor="passportSeries" required>
              Your passport series
            </Label>
            <Input
              id="passportSeries"
              value={values.passportSeries}
              placeholder="0000"
              inputMode="numeric"
              maxLength={4}
              error={getFieldStatus('passportSeries').error}
              isInvalid={getFieldStatus('passportSeries').isInvalid}
              isValid={getFieldStatus('passportSeries').isValid}
              onChange={handleDigitsChange('passportSeries', 4)}
              onBlur={handleBlur('passportSeries')}
            />
          </div>

          <div className="prescoring__field">
            <Label htmlFor="passportNumber" required>
              Your passport number
            </Label>
            <Input
              id="passportNumber"
              value={values.passportNumber}
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
              error={getFieldStatus('passportNumber').error}
              isInvalid={getFieldStatus('passportNumber').isInvalid}
              isValid={getFieldStatus('passportNumber').isValid}
              onChange={handleDigitsChange('passportNumber', 6)}
              onBlur={handleBlur('passportNumber')}
            />
          </div>
        </div>
      </section>

      <div className="prescoring__actions">
        {formMessage && <p className="prescoring__message">{formMessage}</p>}
        <Button className="prescoring__button" type="submit" disabled={isLoading}>
          {isLoading ? <span className="prescoring__loader" aria-label="Loading" /> : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

const LoanHero = () => {
  const handleApplyClick = () => {
    document.getElementById('prescoring')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="loan-hero" aria-labelledby="loan-title">
      <Container>
        <div className="loan-hero__card">
          <div className="loan-hero__content">
            <h1 className="loan-hero__title" id="loan-title">
              Platinum digital credit card
            </h1>
            <p className="loan-hero__description">
              Our best credit card. Suitable for everyday spending and shopping. Cash withdrawals and transfers
              without commission and interest.
            </p>

            <div className="loan-hero__features">
              <Tooltip content="When repaying the full debt up to 160 days.">
                <div className="loan-hero__feature">
                  <span className="loan-hero__feature-title">Up to 160 days</span>
                  <span className="loan-hero__feature-text">No percent</span>
                </div>
              </Tooltip>
              <Tooltip content="Over the limit will accrue percent">
                <div className="loan-hero__feature">
                  <span className="loan-hero__feature-title">Up to 600 000 ₽</span>
                  <span className="loan-hero__feature-text">Credit limit</span>
                </div>
              </Tooltip>
              <Tooltip content="Promotion valid until December 31, 2022.">
                <div className="loan-hero__feature">
                  <span className="loan-hero__feature-title">0 ₽</span>
                  <span className="loan-hero__feature-text">Card service is free</span>
                </div>
              </Tooltip>
            </div>

            <Button className="loan-hero__button" type="button" onClick={handleApplyClick}>
              Apply for card
            </Button>
          </div>

          <div className="credit-card" aria-hidden="true">
            <div className="credit-card__number">5430 4900 3232 9755</div>
            <div className="credit-card__name">Jhon Doe</div>
            <div className="credit-card__valid">Valid date<br />11/24</div>
            <div className="credit-card__circle" />
          </div>
        </div>
      </Container>
    </section>
  );
};

const FaqContent = () => {
  return (
    <div className="loan-tabs__faq">
      <h2 className="loan-tabs__faq-title">Issuing and receiving a card</h2>
      <Accordion items={issuingFaq} />
      <h2 className="loan-tabs__faq-title">Using a credit card</h2>
      <Accordion items={usingFaq}/>
    </div>
  );
};

const TabContent = ({ activeTab }: { activeTab: TabId }) => {
  if (activeTab === 'rates') {
    return (
      <div className="loan-tabs__rates">
        {rates.map((rate) => (
          <div className="loan-tabs__rate" key={rate.name}>
            <div className="loan-tabs__rate-name">{rate.name}</div>
            <div className="loan-tabs__rate-value">{rate.value}</div>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === 'cashback') {
    return (
      <div className="loan-tabs__cashback-grid">
        {cashbackCards.map((card) => (
          <article className={`loan-info-card${card.accent ? ' loan-info-card--accent' : ''}`} key={card.title}>
            <p className="loan-info-card__text">{card.title}</p>
            <h3 className="loan-info-card__title">{card.value}</h3>
          </article>
        ))}
      </div>
    );
  }

  if (activeTab === 'faq') {
    return <FaqContent />;
  }

  return (
    <div className="loan-tabs__about-grid">
      {aboutCards.map((card) => (
        <article
          className={`loan-info-card${card.accent ? ' loan-info-card--accent' : ''}`}
          key={card.title}
        >
          <img className="loan-info-card__icon" src={card.icon} alt="" aria-hidden="true" />
          <h3 className="loan-info-card__title">{card.title}</h3>
          <p className="loan-info-card__text">{card.text}</p>
        </article>
      ))}
    </div>
  );
};

const LoanTabsSection = () => {
  const [activeTab, setActiveTab] = useState<TabId>('about');

  return (
    <section className="loan-tabs" aria-label="Credit card details">
      <Container>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        />
        <TabContent activeTab={activeTab} />
      </Container>
    </section>
  );
};

const Process = () => {
  return (
    <section className="loan-process" aria-labelledby="process-title">
      <Container>
        <h2 className="loan-process__title" id="process-title">
          How to get a card
        </h2>
        <ol className="loan-process__list">
          {processSteps.map((step, index) => (
            <li className="loan-process__item" key={step}>
              <div className="loan-process__number">{index + 1}</div>
              <Divider className="loan-process__divider" />
              <p className="loan-process__text">{step}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
};

export const LoanPage = () => {
  return (
    <>
      <Header />
      <main className="loan-page">
        <LoanHero />
        <LoanTabsSection />
        <Process />
        <Container>
          <PrescoringForm />
        </Container>
      </main>
      <Footer />
    </>
  );
};
