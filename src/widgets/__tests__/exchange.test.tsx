import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getLatestRates } from '@/shared/api/exchange-api';
import { Exchange } from '@/widgets/exchange/exchange';

vi.mock('@/shared/api/exchange-api', () => ({
  getLatestRates: vi.fn(),
}));

const ratesMock = vi.mocked(getLatestRates);

describe('Exchange', () => {
  it('renders static section content and initial currency rows', () => {
    ratesMock.mockResolvedValueOnce({ date: '2026-05-15', rates: {} });

    render(<Exchange />);

    expect(screen.getByRole('heading', { name: 'Exchange rate in internet bank' })).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All courses' })).toHaveAttribute('href', '/');
    expect(screen.getByText('USD:')).toBeInTheDocument();
  });

  it('loads latest rates and formats values and update date', async () => {
    ratesMock.mockResolvedValueOnce({
      date: '2026-05-15',
      rates: {
        USD: 0.01,
        CNY: 0.08,
        CHF: 0.009,
        EUR: 0.011,
        JPY: 1.7,
        GBP: 0.008,
      },
    });

    render(<Exchange />);

    expect(await screen.findByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('Update every 15 minutes, MSC 15.05.2026')).toBeInTheDocument();
    expect(ratesMock).toHaveBeenCalledWith('RUB', ['USD', 'CNY', 'CHF', 'EUR', 'JPY', 'GBP']);
  });

  it('keeps fallback update text when loading rates fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    ratesMock.mockRejectedValueOnce(new Error('Failed'));

    render(<Exchange />);

    await waitFor(() => {
      expect(ratesMock).toHaveBeenCalled();
    });
    expect(screen.getByText('Update every 15 minutes')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
