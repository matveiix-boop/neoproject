import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  applyLoanOffer,
  sendConfirmationCode,
  sendPrescoringApplication,
  subscribeToNewsletter,
  type LoanOffer,
} from '@/shared/api/bank-api';

const fetchMock = vi.fn<typeof fetch>();

const okJsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const okEmptyResponse = () => new Response(null, { status: 200 });

const offer: LoanOffer = {
  applicationId: 1,
  requestedAmount: 150000,
  totalAmount: 160000,
  term: 6,
  monthlyPayment: 27527.85,
  rate: 11,
  isInsuranceEnabled: true,
  isSalaryClient: false,
};

describe('bank-api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('sends newsletter subscription email as trimmed JSON', async () => {
    fetchMock.mockResolvedValueOnce(okEmptyResponse());

    await subscribeToNewsletter(' client@example.com ');

    expect(fetchMock).toHaveBeenCalledWith('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@example.com' }),
    });
  });

  it('normalizes prescoring payload before sending application', async () => {
    fetchMock.mockResolvedValueOnce(okJsonResponse([offer]));

    const result = await sendPrescoringApplication({
      amount: 150000,
      term: 6,
      firstName: ' Ivan ',
      lastName: ' Ivanov ',
      middleName: '',
      email: ' test@example.com ',
      birthdate: '1990-11-11',
      passportSeries: ' 1234 ',
      passportNumber: ' 100001 ',
    });

    expect(result).toEqual([offer]);
    expect(fetchMock).toHaveBeenCalledWith('/api/application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 150000,
        term: 6,
        firstName: 'Ivan',
        lastName: 'Ivanov',
        middleName: null,
        email: 'test@example.com',
        birthdate: '1990-11-11',
        passportSeries: '1234',
        passportNumber: '100001',
      }),
    });
  });

  it('sends selected loan offer without changing its fields', async () => {
    fetchMock.mockResolvedValueOnce(okEmptyResponse());

    await applyLoanOffer(offer);

    expect(fetchMock).toHaveBeenCalledWith('/api/application/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    });
  });

  it('sends trimmed confirmation code as raw body', async () => {
    fetchMock.mockResolvedValueOnce(okEmptyResponse());

    await sendConfirmationCode(1, ' 1234 ');

    expect(fetchMock).toHaveBeenCalledWith('/api/document/1/sign/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '1234',
    });
  });
});
