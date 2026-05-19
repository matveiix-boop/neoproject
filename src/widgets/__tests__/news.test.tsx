import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getTopBusinessNews } from '@/shared/api/news-api';
import { News } from '@/widgets/news/news';

vi.mock('@/shared/api/news-api', () => ({
  getTopBusinessNews: vi.fn(),
}));

const newsMock = vi.mocked(getTopBusinessNews);

const articles = [
  {
    title: 'Bank market grows',
    description: 'Financial sector update',
    url: 'https://example.com/news-1',
    urlToImage: 'https://example.com/image-1.jpg',
  },
  {
    title: 'New card product',
    description: 'Credit cards remain popular',
    url: 'https://example.com/news-2',
    urlToImage: 'https://example.com/image-2.jpg',
  },
];

describe('News', () => {
  it('renders heading and loading state before news are resolved', () => {
    newsMock.mockResolvedValueOnce([]);

    render(<News />);

    expect(screen.getByRole('heading', { name: 'Current news from the world of finance' })).toBeInTheDocument();
    expect(screen.getByText('Loading news...')).toBeInTheDocument();
  });

  it('renders fetched news cards with links and descriptions', async () => {
    newsMock.mockResolvedValueOnce(articles);

    render(<News />);

    expect(await screen.findByRole('link', { name: /Bank market grows/i })).toHaveAttribute(
      'href',
      'https://example.com/news-1',
    );
    expect(screen.getByText('Financial sector update')).toBeInTheDocument();
    expect(screen.getByAltText('New card product')).toHaveAttribute('src', 'https://example.com/image-2.jpg');
  });

  it('shows error state when news request fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    newsMock.mockRejectedValueOnce(new Error('Failed'));

    render(<News />);

    expect(await screen.findByText('Failed to load news. Please try again later.')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
