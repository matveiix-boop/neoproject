const DEFAULT_API_BASE_URL = '/api';
const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;

export type PrescoringApplication = {
  amount: number;
  term: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string;
  birthdate: string;
  passportSeries: string;
  passportNumber: string;
};

export type LoanOffer = {
  applicationId: number;
  requestedAmount: number;
  totalAmount: number;
  term: number;
  monthlyPayment: number;
  rate: number;
  isInsuranceEnabled: boolean;
  isSalaryClient: boolean;
};

export type EmploymentStatus = 'UNEMPLOYED' | 'SELF_EMPLOYED' | 'EMPLOYED' | 'BUSINESS_OWNER';
export type EmploymentPosition = 'WORKER' | 'MID_MANAGER' | 'TOP_MANAGER' | 'OWNER';

export type ScoringApplication = {
  gender: 'MALE' | 'FEMALE';
  maritalStatus: 'MARRIED' | 'DIVORCED' | 'SINGLE' | 'WIDOW_WIDOWER';
  dependentAmount: number;
  passportIssueDate: string;
  passportIssueBranch: string;
  employmentStatus: EmploymentStatus;
  employerINN: string;
  salary: number;
  position: EmploymentPosition;
  workExperienceTotal: number;
  workExperienceCurrent: number;
  employment: {
    employmentStatus: EmploymentStatus;
    employerINN: string;
    salary: number;
    position: EmploymentPosition;
    workExperienceTotal: number;
    workExperienceCurrent: number;
  };
};

export type PaymentScheduleItem = {
  number: number;
  date: string;
  totalPayment: number;
  interestPayment: number;
  debtPayment: number;
  remainingDebt: number;
};

export type ApplicationStatus =
  | 'PREAPPROVAL'
  | 'APPROVED'
  | 'CC_DENIED'
  | 'CC_APPROVED'
  | 'PREPARE_DOCUMENTS'
  | 'DOCUMENT_CREATED'
  | 'CLIENT_DENIED'
  | 'DOCUMENT_SIGNED'
  | 'CREDIT_ISSUED'
  | string;

export type AdminApplication = {
  applicationId?: number;
  id?: number;
  status?: ApplicationStatus;
  credit?: {
    amount?: number;
    term?: number;
    monthlyPayment?: number;
    rate?: number;
    psk?: number;
    paymentSchedule?: PaymentScheduleItem[];
  } | null;
  paymentSchedule?: PaymentScheduleItem[];
};

const normalizeBaseUrl = (baseUrl: string) =>
  baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

const buildUrl = (path: string, baseUrl = RAW_API_BASE_URL) => `${normalizeBaseUrl(baseUrl)}${path}`;

const apiFetch = async (path: string, init?: RequestInit): Promise<Response> => fetch(buildUrl(path), init);

const checkResponse = async (response: Response, errorMessage: string): Promise<void> => {
  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`${errorMessage}: ${response.status}${details ? ` ${details}` : ''}`);
  }
};

const readJson = async <T>(response: Response, errorMessage: string): Promise<T> => {
  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`${errorMessage}: ${response.status}${details ? ` ${details}` : ''}`);
  }

  return response.json() as Promise<T>;
};

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const subscribeToNewsletter = async (email: string): Promise<void> => {
  const response = await apiFetch('/email', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      email: email.trim(),
    }),
  });

  await checkResponse(response, 'Failed to subscribe');
};

export const sendPrescoringApplication = async (
  application: PrescoringApplication,
): Promise<LoanOffer[]> => {
  const response = await apiFetch('/application', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      amount: Number(application.amount),
      term: Number(application.term),
      firstName: application.firstName.trim(),
      lastName: application.lastName.trim(),
      middleName: application.middleName ? application.middleName.trim() : null,
      email: application.email.trim(),
      birthdate: application.birthdate,
      passportSeries: application.passportSeries.trim(),
      passportNumber: application.passportNumber.trim(),
    }),
  });

  return readJson<LoanOffer[]>(response, 'Failed to send application');
};

export const applyLoanOffer = async (offer: LoanOffer): Promise<void> => {
  const response = await apiFetch('/application/apply', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(offer),
  });

  await checkResponse(response, 'Failed to apply offer');
};

export const getApplication = async (applicationId: string | number): Promise<AdminApplication> => {
  const response = await apiFetch(`/admin/application/${applicationId}`);

  return readJson<AdminApplication>(response, 'Failed to load application');
};

export const sendScoringApplication = async (
  applicationId: string | number,
  application: ScoringApplication,
): Promise<void> => {
  const response = await apiFetch(`/application/registration/${applicationId}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(application),
  });

  await checkResponse(response, 'Failed to send scoring application');
};

export const sendDocuments = async (applicationId: string | number): Promise<void> => {
  const response = await apiFetch(`/document/${applicationId}`, {
    method: 'POST',
  });

  await checkResponse(response, 'Failed to send documents');
};

export const signDocuments = async (applicationId: string | number): Promise<void> => {
  const response = await apiFetch(`/document/${applicationId}/sign`, {
    method: 'POST',
  });

  await checkResponse(response, 'Failed to sign documents');
};

export const sendConfirmationCode = async (
  applicationId: string | number,
  code: string,
): Promise<void> => {
  const trimmedCode = code.trim();

  const response = await apiFetch(`/document/${applicationId}/sign/code`, {
    method: 'POST',
    headers: jsonHeaders,
    body: trimmedCode,
  });

  await checkResponse(response, 'Incorrect confirmation code');
};

export const denyApplication = async (applicationId: string | number): Promise<void> => {
  const endpoints = [
    { method: 'PUT', path: `/application/${applicationId}/deny` },
    { method: 'POST', path: `/application/${applicationId}/deny` },
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    const response = await apiFetch(endpoint.path, { method: endpoint.method });

    if (response.ok) {
      return;
    }

    const details = await response.text().catch(() => '');
    lastError = new Error(
      `Failed to deny application: ${response.status}${details ? ` ${details}` : ''}`,
    );

    if (response.status !== 404 && response.status !== 405) {
      throw lastError;
    }
  }

  throw lastError || new Error('Failed to deny application');
};
