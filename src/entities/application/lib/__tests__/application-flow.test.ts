import { describe, expect, it } from 'vitest';

import {
  canOpenStep,
  getCurrentRoute,
  getCurrentStep,
  getLoanButtonText,
  isApplicationDenied,
} from '@/entities/application/lib/application-flow';
import type { StoredApplication } from '@/entities/application/model/application-store';
import type { LoanOffer } from '@/shared/api/bank-api';

const offer: LoanOffer = {
  applicationId: 7,
  requestedAmount: 150000,
  totalAmount: 160000,
  term: 6,
  monthlyPayment: 27000,
  rate: 11,
  isInsuranceEnabled: true,
  isSalaryClient: false,
};

const makeApplication = (overrides: Partial<StoredApplication> = {}): StoredApplication => ({
  applicationId: 7,
  offers: [offer],
  status: 'PREAPPROVAL',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
  ...overrides,
});

describe('application-flow helpers', () => {
  it('returns loan defaults when application is missing', () => {
    expect(getCurrentStep()).toBe('loan');
    expect(getCurrentRoute()).toBe('/loan');
    expect(getLoanButtonText()).toBe('Apply for card');
  });

  it('detects current step and route by backend status', () => {
    const application = makeApplication({ status: 'DOCUMENT_CREATED' });

    expect(getCurrentStep(application)).toBe('sign');
    expect(getCurrentRoute(application)).toBe('/loan/7/document/sign');
    expect(canOpenStep(application, 'document')).toBe(true);
    expect(canOpenStep(application, 'code')).toBe(false);
  });

  it('uses local progress flags when status is not enough', () => {
    const application = makeApplication({ selectedOffer: offer, status: undefined });

    expect(getCurrentStep(application)).toBe('scoring');
    expect(getCurrentRoute(application)).toBe('/loan/7');
    expect(getLoanButtonText(application)).toBe('Continue registration');
  });

  it('treats local and backend denial statuses as denied applications', () => {
    expect(isApplicationDenied(makeApplication({ status: 'CC_DENIED' }))).toBe(true);
    expect(isApplicationDenied(makeApplication({ denied: true }))).toBe(true);
    expect(getLoanButtonText(makeApplication({ status: 'CLIENT_DENIED' }))).toBe('Apply for card');
  });
});
