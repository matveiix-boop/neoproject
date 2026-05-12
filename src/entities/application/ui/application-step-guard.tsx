import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import {
  canOpenStep,
  getCurrentRoute,
  type ApplicationRouteStep,
} from '@/entities/application/lib/application-flow';
import { useApplicationStore } from '@/entities/application/model/application-store';
import { Loader } from '@/shared/ui/loader/loader';

type ApplicationStepGuardProps = {
  step: ApplicationRouteStep;
  children: ReactNode;
};

export const ApplicationStepGuard = ({ step, children }: ApplicationStepGuardProps) => {
  const { applicationId } = useParams();
  const { state, setCurrentApplication, refreshApplication } = useApplicationStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isMissingApplication, setIsMissingApplication] = useState(false);
  const id = applicationId ? Number(applicationId) : NaN;
  const isValidId = Number.isInteger(id) && id > 0;
  const application = isValidId ? state.applications[String(id)] : undefined;
  const hasStoredApplication = Boolean(application);

  useEffect(() => {
    if (!isValidId || !hasStoredApplication) {
      setIsChecking(false);
      setIsMissingApplication(true);
      return;
    }

    let isCancelled = false;

    setIsChecking(true);
    setIsMissingApplication(false);
    setCurrentApplication(id);

    refreshApplication(id)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsChecking(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id, isValidId, hasStoredApplication, refreshApplication, setCurrentApplication]);

  if (isChecking) {
    return (
      <div className="application-flow-page__loader">
        <Loader />
      </div>
    );
  }

  if (!isValidId || isMissingApplication || !application) {
    return <Navigate to="/not-found" replace />;
  }

  if (!canOpenStep(application, step)) {
    return <Navigate to={getCurrentRoute(application)} replace />;
  }

  return <>{children}</>;
};
