import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { subscribeToNewsletter } from '@/shared/api/bank-api';
import { Subscribe } from '@/widgets/subscribe/subscribe';

vi.mock('@/shared/api/bank-api', () => ({
  subscribeToNewsletter: vi.fn(),
}));

const subscribeMock = vi.mocked(subscribeToNewsletter);

describe('Subscribe', () => {
  it('renders newsletter form when user is not subscribed', () => {
    render(<Subscribe />);

    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('sends trimmed email, saves subscription and shows success text', async () => {
    subscribeMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<Subscribe />);

    await user.type(screen.getByPlaceholderText('Your email'), 'client@example.com   ');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    await waitFor(() => {
      expect(subscribeMock).toHaveBeenCalledWith('client@example.com');
    });
    expect(localStorage.getItem('neobank_newsletter_subscribed')).toBe('true');
    expect(screen.getByText("You are already subscribed to the bank's newsletter")).toBeInTheDocument();
  });

  it('restores subscribed state from localStorage', () => {
    localStorage.setItem('neobank_newsletter_subscribed', 'true');

    render(<Subscribe />);

    expect(screen.getByText("You are already subscribed to the bank's newsletter")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Your email')).not.toBeInTheDocument();
  });

  it('shows error message when request fails', async () => {
    subscribeMock.mockRejectedValueOnce(new Error('Network error'));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<Subscribe />);

    await user.type(screen.getByPlaceholderText('Your email'), 'client@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(await screen.findByText('Failed to subscribe. Please try again later.')).toBeInTheDocument();
    expect(localStorage.getItem('neobank_newsletter_subscribed')).toBeNull();
    consoleError.mockRestore();
  });
});
