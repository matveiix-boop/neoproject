import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ApplicationStepGuard } from '@/entities/application/ui/application-step-guard';
import { ApplicationDeniedMessage } from '@/entities/application/ui/application-denied-message';
import { useApplicationStore, useStoredApplication } from '@/entities/application/model/application-store';
import { getCurrentStep, isApplicationDenied, routeStepOrder } from '@/entities/application/lib/application-flow';
import { sendScoringApplication, type ScoringApplication } from '@/shared/api/bank-api';
import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';
import { Input } from '@/shared/ui/input/input';
import { Label } from '@/shared/ui/label/label';
import { Loader } from '@/shared/ui/loader/loader';
import { Select } from '@/shared/ui/select/select';
import { StatusMessage } from '@/shared/ui/status-message/status-message';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';

import '@/pages/application-flow-page/application-flow-page.scss';

type ScoringValues = {
  gender: string;
  maritalStatus: string;
  dependentAmount: string;
  passportIssueDate: string;
  passportIssueBranch: string;
  employmentStatus: string;
  employerINN: string;
  salary: string;
  position: string;
  workExperienceTotal: string;
  workExperienceCurrent: string;
};

type ScoringFieldName = keyof ScoringValues;
type ScoringErrors = Partial<Record<ScoringFieldName, string>>;

const initialValues: ScoringValues = {
  gender: '',
  maritalStatus: '',
  dependentAmount: '',
  passportIssueDate: '',
  passportIssueBranch: '',
  employmentStatus: '',
  employerINN: '',
  salary: '',
  position: '',
  workExperienceTotal: '',
  workExperienceCurrent: '',
};

const genderOptions = [
  { value: '', label: 'Select one of the options' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const maritalStatusOptions = [
  { value: '', label: 'Select one of the options' },
  { value: 'MARRIED', label: 'Married' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'SINGLE', label: 'Single' },
  { value: 'WIDOW_WIDOWER', label: 'Widow / Widower' },
];

const employmentStatusOptions = [
  { value: '', label: 'Select one of the options' },
  { value: 'UNEMPLOYED', label: 'Unemployed' },
  { value: 'SELF_EMPLOYED', label: 'Self-employed' },
  { value: 'EMPLOYED', label: 'Employed' },
  { value: 'BUSINESS_OWNER', label: 'Business owner' },
];

const positionOptions = [
  { value: '', label: 'Select one of the options' },
  { value: 'WORKER', label: 'Worker' },
  { value: 'MID_MANAGER', label: 'Mid manager' },
  { value: 'TOP_MANAGER', label: 'Top manager' },
  { value: 'OWNER', label: 'Owner' },
];

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatPassportIssueBranch = (value: string) => {
  const digits = onlyDigits(value).slice(0, 6);

  if (digits.length <= 3) {
    return digits;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
};

const isValidDate = (value: string) => {
  if (!value) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    Boolean(year && month && day) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const validateValues = (values: ScoringValues): ScoringErrors => {
  const errors: ScoringErrors = {};

  if (!values.gender) {
    errors.gender = 'Select one of the options';
  }

  if (!values.maritalStatus) {
    errors.maritalStatus = 'Select one of the options';
  }

  if (!values.dependentAmount.trim()) {
    errors.dependentAmount = 'Enter number of dependents';
  }

  if (!isValidDate(values.passportIssueDate)) {
    errors.passportIssueDate = 'Incorrect date of passport issue date';
  } else if (new Date(values.passportIssueDate) > new Date()) {
    errors.passportIssueDate = 'Incorrect date of passport issue date';
  }

  if (!/^\d{3}-\d{3}$/.test(values.passportIssueBranch)) {
    errors.passportIssueBranch = 'The series must be 6 digits';
  }

  if (!values.employmentStatus) {
    errors.employmentStatus = 'Select one of the options';
  }

  if (!/^\d{12}$/.test(values.employerINN)) {
    errors.employerINN = 'Department code must be 12 digits';
  }

  if (!values.salary.trim()) {
    errors.salary = 'Enter your salary';
  }

  if (!values.position) {
    errors.position = 'Select one of the options';
  }

  if (!values.workExperienceTotal.trim()) {
    errors.workExperienceTotal = 'Enter total work experience';
  }

  if (!values.workExperienceCurrent.trim()) {
    errors.workExperienceCurrent = 'Enter your work experience current';
  }

  return errors;
};

const ScoringForm = ({ applicationId }: { applicationId: number }) => {
  const { updateApplication } = useApplicationStore();
  const [values, setValues] = useState<ScoringValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<ScoringFieldName, boolean>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const errors = useMemo(() => validateValues(values), [values]);

  const getFieldStatus = (name: ScoringFieldName) => {
    const isVisible = Boolean(touched[name] || isSubmitted);
    const hasValue = String(values[name]).trim().length > 0;

    return {
      error: errors[name],
      isInvalid: isVisible && Boolean(errors[name]),
      isValid: isVisible && !errors[name] && hasValue,
    };
  };

  const setValue = (name: ScoringFieldName, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setMessage(null);
  };

  const handleTextChange = (name: ScoringFieldName) => (event: ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value.trimEnd());
  };

  const handleDigitsChange =
    (name: ScoringFieldName, maxLength?: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const digits = onlyDigits(event.target.value);
      setValue(name, maxLength ? digits.slice(0, maxLength) : digits);
    };

  const handleBlur = (name: ScoringFieldName) => () => {
    setValues((currentValues) => ({ ...currentValues, [name]: String(currentValues[name]).trim() }));
    setTouched((currentTouched) => ({ ...currentTouched, [name]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setMessage(null);

    const nextErrors = validateValues(values);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload: ScoringApplication = {
      gender: values.gender as ScoringApplication['gender'],
      maritalStatus: values.maritalStatus as ScoringApplication['maritalStatus'],
      dependentAmount: Number(values.dependentAmount),
      passportIssueDate: values.passportIssueDate,
      passportIssueBranch: values.passportIssueBranch,
      employmentStatus: values.employmentStatus as ScoringApplication['employmentStatus'],
      employerINN: values.employerINN,
      salary: Number(values.salary),
      position: values.position as ScoringApplication['position'],
      workExperienceTotal: Number(values.workExperienceTotal),
      workExperienceCurrent: Number(values.workExperienceCurrent),
      employment: {
        employmentStatus: values.employmentStatus as ScoringApplication['employmentStatus'],
        employerINN: values.employerINN,
        salary: Number(values.salary),
        position: values.position as ScoringApplication['position'],
        workExperienceTotal: Number(values.workExperienceTotal),
        workExperienceCurrent: Number(values.workExperienceCurrent),
      },
    };

    try {
      setIsLoading(true);
      await sendScoringApplication(applicationId, payload);
      updateApplication(applicationId, { scoringSubmitted: true });
      setMessage('Wait for a decision on the application. The answer will come to your mail.');
    } catch (error) {
      console.error(error);
      setMessage('Failed to send scoring data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flow-form" onSubmit={handleSubmit} noValidate>
      {message && <p className="application-flow-page__error">{message}</p>}

      <div className="flow-form__grid">
        <div className="flow-form__field">
          <Label htmlFor="gender" required>
            What`s your gender
          </Label>
          <Select
            id="gender"
            options={genderOptions}
            value={values.gender}
            error={getFieldStatus('gender').error}
            isInvalid={getFieldStatus('gender').isInvalid}
            onChange={(event) => setValue('gender', event.target.value)}
            onBlur={handleBlur('gender')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="maritalStatus" required>
            Your marital status
          </Label>
          <Select
            id="maritalStatus"
            options={maritalStatusOptions}
            value={values.maritalStatus}
            error={getFieldStatus('maritalStatus').error}
            isInvalid={getFieldStatus('maritalStatus').isInvalid}
            onChange={(event) => setValue('maritalStatus', event.target.value)}
            onBlur={handleBlur('maritalStatus')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="dependentAmount" required>
            Your number of dependents
          </Label>
          <Input
            id="dependentAmount"
            value={values.dependentAmount}
            type="number"
            inputMode="numeric"
            placeholder="For example 1"
            error={getFieldStatus('dependentAmount').error}
            isInvalid={getFieldStatus('dependentAmount').isInvalid}
            isValid={getFieldStatus('dependentAmount').isValid}
            onChange={handleDigitsChange('dependentAmount')}
            onBlur={handleBlur('dependentAmount')}
          />
        </div>

      </div>

      <div className="flow-form__grid flow-form__grid--two">
        <div className="flow-form__field">
          <Label htmlFor="passportIssueDate" required>
            Date of issue of the passport
          </Label>
          <Input
            id="passportIssueDate"
            value={values.passportIssueDate}
            type="date"
            error={getFieldStatus('passportIssueDate').error}
            isInvalid={getFieldStatus('passportIssueDate').isInvalid}
            isValid={getFieldStatus('passportIssueDate').isValid}
            onChange={handleTextChange('passportIssueDate')}
            onBlur={handleBlur('passportIssueDate')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="passportIssueBranch" required>
            Division code
          </Label>
          <Input
            id="passportIssueBranch"
            value={values.passportIssueBranch}
            placeholder="123-456"
            maxLength={7}
            error={getFieldStatus('passportIssueBranch').error}
            isInvalid={getFieldStatus('passportIssueBranch').isInvalid}
            isValid={getFieldStatus('passportIssueBranch').isValid}
            onChange={(event) => setValue('passportIssueBranch', formatPassportIssueBranch(event.target.value))}
            onBlur={handleBlur('passportIssueBranch')}
          />
        </div>
      </div>

      <h2 className="flow-form__section-title">Employment</h2>

      <div className="flow-form__grid">
        <div className="flow-form__field">
          <Label htmlFor="employmentStatus" required>
            Your employment status
          </Label>
          <Select
            id="employmentStatus"
            options={employmentStatusOptions}
            value={values.employmentStatus}
            error={getFieldStatus('employmentStatus').error}
            isInvalid={getFieldStatus('employmentStatus').isInvalid}
            onChange={(event) => setValue('employmentStatus', event.target.value)}
            onBlur={handleBlur('employmentStatus')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="employerINN" required>
            Your employer INN
          </Label>
          <Input
            id="employerINN"
            value={values.employerINN}
            placeholder="000000000000"
            inputMode="numeric"
            maxLength={12}
            error={getFieldStatus('employerINN').error}
            isInvalid={getFieldStatus('employerINN').isInvalid}
            isValid={getFieldStatus('employerINN').isValid}
            onChange={handleDigitsChange('employerINN', 12)}
            onBlur={handleBlur('employerINN')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="salary" required>
            Your salary
          </Label>
          <Input
            id="salary"
            value={values.salary}
            type="number"
            inputMode="numeric"
            placeholder="For example 50000"
            error={getFieldStatus('salary').error}
            isInvalid={getFieldStatus('salary').isInvalid}
            isValid={getFieldStatus('salary').isValid}
            onChange={handleDigitsChange('salary')}
            onBlur={handleBlur('salary')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="position" required>
            Your position
          </Label>
          <Select
            id="position"
            options={positionOptions}
            value={values.position}
            error={getFieldStatus('position').error}
            isInvalid={getFieldStatus('position').isInvalid}
            onChange={(event) => setValue('position', event.target.value)}
            onBlur={handleBlur('position')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="workExperienceTotal" required>
            Your work experience total
          </Label>
          <Input
            id="workExperienceTotal"
            value={values.workExperienceTotal}
            inputMode="numeric"
            maxLength={2}
            placeholder="For example 10"
            error={getFieldStatus('workExperienceTotal').error}
            isInvalid={getFieldStatus('workExperienceTotal').isInvalid}
            isValid={getFieldStatus('workExperienceTotal').isValid}
            onChange={handleDigitsChange('workExperienceTotal', 2)}
            onBlur={handleBlur('workExperienceTotal')}
          />
        </div>

        <div className="flow-form__field">
          <Label htmlFor="workExperienceCurrent" required>
            Your work experience current
          </Label>
          <Input
            id="workExperienceCurrent"
            value={values.workExperienceCurrent}
            inputMode="numeric"
            maxLength={2}
            placeholder="For example 2"
            error={getFieldStatus('workExperienceCurrent').error}
            isInvalid={getFieldStatus('workExperienceCurrent').isInvalid}
            isValid={getFieldStatus('workExperienceCurrent').isValid}
            onChange={handleDigitsChange('workExperienceCurrent', 2)}
            onBlur={handleBlur('workExperienceCurrent')}
          />
        </div>
      </div>

      <div className="flow-form__actions">
        <Button className="flow-form__button" type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

const ScoringPageContent = () => {
  const { applicationId } = useParams();
  const id = Number(applicationId);
  const { refreshApplication } = useApplicationStore();
  const application = useStoredApplication(id);
  const currentStep = getCurrentStep(application);
  const isDenied = isApplicationDenied(application);
  const isDecisionPending = Boolean(
    application?.scoringSubmitted && !isDenied && currentStep === 'scoring',
  );
  const isPastScoring = application
    ? routeStepOrder[currentStep] > routeStepOrder.scoring || Boolean(application.scoringSubmitted)
    : false;

  useEffect(() => {
    if (!isDecisionPending) {
      return undefined;
    }

    refreshApplication(id).catch((error) => console.error(error));

    const intervalId = window.setInterval(() => {
      refreshApplication(id).catch((error) => console.error(error));
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [id, isDecisionPending, refreshApplication]);

  if (isDenied) {
    return <ApplicationDeniedMessage />;
  }

  if (isPastScoring) {
    return (
      <StatusMessage
        title="Wait for a decision on the application"
        text="The answer will come to your mail within a few minutes."
      />
    );
  }

  return (
    <main className="application-flow-page">
      <Container>
        <section className="application-flow-page__card" aria-labelledby="scoring-title">
          <div className="application-flow-page__header">
            <h1 className="application-flow-page__title" id="scoring-title">
              Continuation of the application
            </h1>
            <span className="application-flow-page__step">Step 2 of 5</span>
          </div>
          <ScoringForm applicationId={id} />
        </section>
      </Container>
    </main>
  );
};

export const ScoringPage = () => {
  return (
    <>
      <Header />
      <ApplicationStepGuard step="scoring">
        <ScoringPageContent />
      </ApplicationStepGuard>
      <Footer />
    </>
  );
};
