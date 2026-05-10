import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import {
  getApplication,
  type AdminApplication,
  type ApplicationStatus,
  type LoanOffer,
} from '@/shared/api/bank-api';

const STORAGE_KEY = 'neobank:applications:v1';

type ApplicationFlags = {
  scoringSubmitted?: boolean;
  documentsSent?: boolean;
  signSent?: boolean;
  completed?: boolean;
  denied?: boolean;
};

export type StoredApplication = ApplicationFlags & {
  applicationId: number;
  offers: LoanOffer[];
  selectedOffer?: LoanOffer;
  status?: ApplicationStatus;
  admin?: AdminApplication;
  createdAt: string;
  updatedAt: string;
};

type ApplicationState = {
  currentApplicationId: number | null;
  applications: Record<string, StoredApplication>;
};

type ApplicationAction =
  | { type: 'restore'; payload: ApplicationState }
  | { type: 'saveOffers'; offers: LoanOffer[] }
  | { type: 'selectOffer'; applicationId: number; offer: LoanOffer }
  | { type: 'setCurrentApplication'; applicationId: number | null }
  | {
      type: 'updateApplication';
      applicationId: number;
      payload: Partial<Omit<StoredApplication, 'applicationId' | 'createdAt'>>;
    }
  | { type: 'upsertApplicationFromAdmin'; applicationId: number; application: AdminApplication }
  | { type: 'clearApplication'; applicationId: number };

const initialState: ApplicationState = {
  currentApplicationId: null,
  applications: {},
};

const getNow = () => new Date().toISOString();

const sortOffers = (offers: LoanOffer[]) => {
  return [...offers].sort((firstOffer, secondOffer) => {
    const firstScore = firstOffer.rate + (firstOffer.isInsuranceEnabled ? -0.2 : 0) + (firstOffer.isSalaryClient ? -0.1 : 0);
    const secondScore = secondOffer.rate + (secondOffer.isInsuranceEnabled ? -0.2 : 0) + (secondOffer.isSalaryClient ? -0.1 : 0);

    if (firstScore !== secondScore) {
      return secondScore - firstScore;
    }

    return secondOffer.totalAmount - firstOffer.totalAmount;
  });
};

const normalizeStoredApplication = (application: StoredApplication): StoredApplication => ({
  ...application,
  offers: sortOffers(application.offers || []),
});

const statusOrder: ApplicationStatus[] = [
  'PREAPPROVAL',
  'APPROVED',
  'CC_APPROVED',
  'PREPARE_DOCUMENTS',
  'DOCUMENT_CREATED',
  'DOCUMENT_SIGNED',
  'CREDIT_ISSUED',
];

const isStatusAtLeast = (status: ApplicationStatus | undefined, target: ApplicationStatus) => {
  if (!status) {
    return false;
  }

  const statusIndex = statusOrder.indexOf(status);
  const targetIndex = statusOrder.indexOf(target);

  return statusIndex >= targetIndex && targetIndex !== -1;
};

const getStatusIndex = (status: ApplicationStatus | undefined) => {
  if (!status) {
    return -1;
  }

  return statusOrder.indexOf(status);
};

const getLatestStatus = (
  adminStatus: ApplicationStatus | undefined,
  localStatus: ApplicationStatus | undefined,
) => {
  if (adminStatus === 'CLIENT_DENIED' || adminStatus === 'CC_DENIED') {
    return adminStatus;
  }

  if (localStatus === 'CLIENT_DENIED' || localStatus === 'CC_DENIED') {
    return localStatus;
  }

  const adminStatusIndex = getStatusIndex(adminStatus);
  const localStatusIndex = getStatusIndex(localStatus);

  if (adminStatusIndex === -1 && localStatusIndex === -1) {
    return adminStatus || localStatus;
  }

  return adminStatusIndex >= localStatusIndex ? adminStatus : localStatus;
};

const getApplicationFlagsByStatus = (status: ApplicationStatus | undefined): ApplicationFlags => ({
  scoringSubmitted: isStatusAtLeast(status, 'CC_APPROVED') || status === 'CC_DENIED',
  documentsSent: isStatusAtLeast(status, 'PREPARE_DOCUMENTS'),
  signSent: isStatusAtLeast(status, 'DOCUMENT_SIGNED'),
  completed: status === 'CREDIT_ISSUED',
  denied: status === 'CLIENT_DENIED' || status === 'CC_DENIED',
});

const createStoredApplicationFromAdmin = (
  applicationId: number,
  admin: AdminApplication,
  existingApplication?: StoredApplication,
): StoredApplication => {
  const status = getLatestStatus(admin.status, existingApplication?.status);
  const now = getNow();

  return normalizeStoredApplication({
    applicationId,
    offers: existingApplication?.offers || [],
    selectedOffer: existingApplication?.selectedOffer,
    status,
    admin,
    createdAt: existingApplication?.createdAt || now,
    updatedAt: now,
    ...getApplicationFlagsByStatus(status),
  });
};

const reducer = (state: ApplicationState, action: ApplicationAction): ApplicationState => {
  if (action.type === 'restore') {
    return action.payload;
  }

  if (action.type === 'saveOffers') {
    const offers = sortOffers(action.offers);
    const applicationId = offers[0]?.applicationId;

    if (!applicationId) {
      return state;
    }

    const existingApplication = state.applications[String(applicationId)];
    const now = getNow();

    return {
      currentApplicationId: applicationId,
      applications: {
        ...state.applications,
        [String(applicationId)]: normalizeStoredApplication({
          applicationId,
          offers,
          selectedOffer: existingApplication?.selectedOffer,
          status: existingApplication?.status || 'PREAPPROVAL',
          admin: existingApplication?.admin,
          createdAt: existingApplication?.createdAt || now,
          updatedAt: now,
          scoringSubmitted: existingApplication?.scoringSubmitted,
          documentsSent: existingApplication?.documentsSent,
          signSent: existingApplication?.signSent,
          completed: existingApplication?.completed,
          denied: existingApplication?.denied,
        }),
      },
    };
  }

  if (action.type === 'selectOffer') {
    const application = state.applications[String(action.applicationId)];

    if (!application) {
      return state;
    }

    return {
      ...state,
      currentApplicationId: action.applicationId,
      applications: {
        ...state.applications,
        [String(action.applicationId)]: normalizeStoredApplication({
          ...application,
          selectedOffer: action.offer,
          status: application.status === 'PREAPPROVAL' ? 'APPROVED' : application.status,
          updatedAt: getNow(),
        }),
      },
    };
  }

  if (action.type === 'setCurrentApplication') {
    return {
      ...state,
      currentApplicationId: action.applicationId,
    };
  }

  if (action.type === 'updateApplication') {
    const application = state.applications[String(action.applicationId)];

    if (!application) {
      return state;
    }

    return {
      ...state,
      applications: {
        ...state.applications,
        [String(action.applicationId)]: normalizeStoredApplication({
          ...application,
          ...action.payload,
          updatedAt: getNow(),
        }),
      },
    };
  }

  if (action.type === 'upsertApplicationFromAdmin') {
    const existingApplication = state.applications[String(action.applicationId)];

    return {
      ...state,
      currentApplicationId: action.applicationId,
      applications: {
        ...state.applications,
        [String(action.applicationId)]: createStoredApplicationFromAdmin(
          action.applicationId,
          action.application,
          existingApplication,
        ),
      },
    };
  }

  if (action.type === 'clearApplication') {
    const applications = { ...state.applications };
    delete applications[String(action.applicationId)];

    return {
      applications,
      currentApplicationId:
        state.currentApplicationId === action.applicationId ? null : state.currentApplicationId,
    };
  }

  return state;
};

const readStoredState = (): ApplicationState => {
  if (typeof window === 'undefined') {
    return initialState;
  }

  try {
    const storedState = window.localStorage.getItem(STORAGE_KEY);

    if (!storedState) {
      return initialState;
    }

    const parsedState = JSON.parse(storedState) as ApplicationState;
    const applications = Object.fromEntries(
      Object.entries(parsedState.applications || {}).map(([applicationId, application]) => [
        applicationId,
        normalizeStoredApplication(application),
      ]),
    );

    return {
      currentApplicationId: parsedState.currentApplicationId || null,
      applications,
    };
  } catch (error) {
    console.error('Failed to restore application state', error);
    return initialState;
  }
};

const writeStoredState = (state: ApplicationState) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save application state', error);
  }
};

type ApplicationStoreValue = {
  state: ApplicationState;
  saveOffers: (offers: LoanOffer[]) => void;
  selectOffer: (applicationId: number, offer: LoanOffer) => void;
  setCurrentApplication: (applicationId: number | null) => void;
  updateApplication: (
    applicationId: number,
    payload: Partial<Omit<StoredApplication, 'applicationId' | 'createdAt'>>,
  ) => void;
  clearApplication: (applicationId: number) => void;
  refreshApplication: (applicationId: number) => Promise<AdminApplication>;
};

const ApplicationStoreContext = createContext<ApplicationStoreValue | null>(null);

export const ApplicationStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState, readStoredState);

  useEffect(() => {
    writeStoredState(state);
  }, [state]);

  const saveOffers = useCallback((offers: LoanOffer[]) => {
    dispatch({ type: 'saveOffers', offers });
  }, []);

  const selectOffer = useCallback((applicationId: number, offer: LoanOffer) => {
    dispatch({ type: 'selectOffer', applicationId, offer });
  }, []);

  const setCurrentApplication = useCallback((applicationId: number | null) => {
    dispatch({ type: 'setCurrentApplication', applicationId });
  }, []);

  const updateApplication = useCallback(
    (
      applicationId: number,
      payload: Partial<Omit<StoredApplication, 'applicationId' | 'createdAt'>>,
    ) => {
      dispatch({ type: 'updateApplication', applicationId, payload });
    },
    [],
  );

  const clearApplication = useCallback((applicationId: number) => {
    dispatch({ type: 'clearApplication', applicationId });
  }, []);

  const refreshApplication = useCallback(async (applicationId: number) => {
    const application = await getApplication(applicationId);

    dispatch({
      type: 'upsertApplicationFromAdmin',
      applicationId,
      application,
    });

    return application;
  }, []);

  const value = useMemo(
    () => ({
      state,
      saveOffers,
      selectOffer,
      setCurrentApplication,
      updateApplication,
      clearApplication,
      refreshApplication,
    }),
    [
      state,
      saveOffers,
      selectOffer,
      setCurrentApplication,
      updateApplication,
      clearApplication,
      refreshApplication,
    ],
  );

  return (
    <ApplicationStoreContext.Provider value={value}>{children}</ApplicationStoreContext.Provider>
  );
};

export const useApplicationStore = () => {
  const context = useContext(ApplicationStoreContext);

  if (!context) {
    throw new Error('useApplicationStore must be used inside ApplicationStoreProvider');
  }

  return context;
};

export const useStoredApplication = (applicationId?: string | number) => {
  const { state } = useApplicationStore();

  if (!applicationId) {
    return undefined;
  }

  return state.applications[String(applicationId)];
};
