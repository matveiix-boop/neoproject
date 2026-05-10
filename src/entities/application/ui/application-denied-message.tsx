import { useNavigate } from 'react-router-dom';

import { useApplicationStore } from '@/entities/application/model/application-store';
import { Button } from '@/shared/ui/button/button';
import { StatusMessage } from '@/shared/ui/status-message/status-message';

type ApplicationDeniedMessageProps = {
  title?: string;
  text?: string;
};

export const ApplicationDeniedMessage = ({
  title = 'Your application has been denied',
  text = 'You can return to the main page and choose another product.',
}: ApplicationDeniedMessageProps) => {
  const navigate = useNavigate();
  const { setCurrentApplication } = useApplicationStore();

  const goHome = () => {
    setCurrentApplication(null);
    navigate('/');
  };

  return (
    <StatusMessage title={title} text={text}>
      <Button type="button" onClick={goHome}>
        Go home
      </Button>
    </StatusMessage>
  );
};
