import type { ApplicationStatus } from '@/shared/api/bank-api';
import type { StoredApplication } from '@/entities/application/model/application-store';

export type ApplicationRouteStep = 'loan' | 'scoring' | 'document' | 'sign' | 'code';

export const routeStepOrder: Record<ApplicationRouteStep, number> = {
  loan: 1,
  scoring: 2,
  document: 3,
  sign: 4,
  code: 5,
};

const statusCurrentStep: Record<string, ApplicationRouteStep> = {
  PREAPPROVAL: 'loan',
  APPROVED: 'scoring',
  CC_APPROVED: 'document',
  PREPARE_DOCUMENTS: 'document',
  DOCUMENT_CREATED: 'sign',
  DOCUMENT_SIGNED: 'code',
  CREDIT_ISSUED: 'code',
  CLIENT_DENIED: 'document',
  CC_DENIED: 'scoring',
};

export const deniedStatuses = ['CC_DENIED', 'CLIENT_DENIED'];

export const getApplicationStatus = (application?: StoredApplication): ApplicationStatus | undefined => {
  return application?.status || application?.admin?.status;
};

export const isApplicationDenied = (application?: StoredApplication) => {
  const status = getApplicationStatus(application);

  return Boolean(application?.denied || (status && deniedStatuses.includes(status)));
};

const getLocalStep = (application: StoredApplication): ApplicationRouteStep => {
  if (application.completed || application.signSent) {
    return 'code';
  }

  if (application.documentsSent) {
    return 'sign';
  }

  if (application.scoringSubmitted || application.selectedOffer) {
    return 'scoring';
  }

  return 'loan';
};

export const getCurrentStep = (application?: StoredApplication): ApplicationRouteStep => {
  if (!application) {
    return 'loan';
  }

  const status = getApplicationStatus(application);

  if (status === 'CC_DENIED') {
    return 'scoring';
  }

  if (status === 'CLIENT_DENIED' || application.denied) {
    return 'document';
  }

  const statusStep = status ? statusCurrentStep[status] : undefined;

  if (statusStep) {
    return statusStep;
  }

  return getLocalStep(application);
};

export const getMaxAllowedStep = (application?: StoredApplication) => {
  return routeStepOrder[getCurrentStep(application)];
};

export const canOpenStep = (application: StoredApplication | undefined, step: ApplicationRouteStep) => {
  if (!application) {
    return false;
  }

  return routeStepOrder[step] <= getMaxAllowedStep(application);
};

export const getCurrentRoute = (application?: StoredApplication) => {
  if (!application) {
    return '/loan';
  }

  const step = getCurrentStep(application);

  if (step === 'loan') {
    return '/loan';
  }

  if (step === 'scoring') {
    return `/loan/${application.applicationId}`;
  }

  if (step === 'document') {
    return `/loan/${application.applicationId}/document`;
  }

  if (step === 'sign') {
    return `/loan/${application.applicationId}/document/sign`;
  }

  return `/loan/${application.applicationId}/code`;
};

export const getLoanButtonText = (application?: StoredApplication) => {
  if (!application || isApplicationDenied(application) || getCurrentStep(application) === 'loan') {
    return 'Apply for card';
  }

  return 'Continue registration';
};
