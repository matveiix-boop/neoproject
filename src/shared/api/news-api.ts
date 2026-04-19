export type NewsArticle = {
  title: string;
  url: string;
  urlToImage: string;
  description: string;
};

type RawNewsArticle = {
  title?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  description?: string | null;
};

type NewsApiResponse = {
  status: 'ok' | 'error';
  totalResults?: number;
  articles?: RawNewsArticle[];
  message?: string;
};

const API_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const CACHE_KEY = 'news_business_cache_v1';
const CACHE_TTL = 1000 * 60 * 30; // 30 минут

const stripHtml = (value: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');
  return (doc.body.textContent || '').trim();
};

const isValidText = (value: string | null | undefined): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const loadImage = (src: string): Promise<boolean> =>
  new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);

    img.src = src;
  });

const getCachedNews = (): NewsArticle[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as {
      timestamp: number;
      data: NewsArticle[];
    };

    if (!parsed.timestamp || !Array.isArray(parsed.data)) {
      return null;
    }

    const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const setCachedNews = (data: NewsArticle[]) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // ignore cache errors
  }
};

export const getTopBusinessNews = async (): Promise<NewsArticle[]> => {
  const cached = getCachedNews();

  if (cached && cached.length >= 20) {
    return cached;
  }

  const params = new URLSearchParams({
    country: 'us',
    category: 'business',
    pageSize: '30',
    apiKey: API_KEY,
  });

  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data: NewsApiResponse = await response.json();

  if (data.status !== 'ok' || !Array.isArray(data.articles)) {
    throw new Error(data.message || 'Failed to load news');
  }

  const normalized = data.articles
    .map((article) => {
      const title = isValidText(article.title) ? article.title.trim() : '';
      const url = isValidText(article.url) ? article.url.trim() : '';
      const urlToImage = isValidText(article.urlToImage)
        ? article.urlToImage.trim()
        : '';
      const description = isValidText(article.description)
        ? stripHtml(article.description)
        : '';

      return {
        title,
        url,
        urlToImage,
        description,
      };
    })
    .filter(
      (article) =>
        article.title &&
        article.url &&
        article.urlToImage &&
        article.description
    );

  const imageChecks = await Promise.all(
    normalized.map(async (article) => ({
      article,
      isImageValid: await loadImage(article.urlToImage),
    }))
  );

  const validArticles = imageChecks
    .filter((item) => item.isImageValid)
    .map((item) => item.article);

  setCachedNews(validArticles);

  return validArticles;
};