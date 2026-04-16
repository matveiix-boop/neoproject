const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST =
  import.meta.env.VITE_RAPIDAPI_HOST ||
  'currency-conversion-and-exchange-rates.p.rapidapi.com';

const API_BASE_URL = `https://${API_HOST}`;

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CNY' | 'CHF' | 'JPY';

type LatestResponse = {
  success?: boolean;
  timestamp?: number;
  base?: string;
  date?: string;
  rates: Record<string, number>;
};

export async function getLatestRates(
  base: string,
  symbols: CurrencyCode[]
): Promise<LatestResponse> {
  const query = new URLSearchParams({
    base,
    symbols: symbols.join(','),
  });

  const response = await fetch(`${API_BASE_URL}/latest?${query.toString()}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load rates: ${response.status}`);
  }

  return response.json();
}
