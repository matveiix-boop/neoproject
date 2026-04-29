const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const checkResponse = async (response: Response, errorMessage: string): Promise<void> => {
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }
};

export const subscribeToNewsletter = async (email: string): Promise<void> => {
  const response = await fetch(buildUrl('/email'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
    }),
  });

  await checkResponse(response, 'Failed to subscribe');
};

export const sendPrescoringApplication = async (
  application: PrescoringApplication,
): Promise<void> => {
  const response = await fetch(buildUrl('/application'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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

  await checkResponse(response, 'Failed to send application');
};