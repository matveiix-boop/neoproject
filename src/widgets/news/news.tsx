import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getTopBusinessNews, type NewsArticle } from '@/shared/api/news-api';
import arrowLeft from '@/shared/assets/images/arrow-left.svg';
import arrowRight from '@/shared/assets/images/arrow-right.svg';
import './news.scss';

const DESKTOP_SLIDE_STEP = 500;
const MOBILE_SLIDE_STEP = 250;
const MOBILE_BREAKPOINT = 768;
const EDGE_TOLERANCE = 8;

export const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const news = await getTopBusinessNews();
        setArticles(news);
      } catch (err) {
        console.error('Failed to load news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadNews();
  }, []);

  useEffect(() => {
    const updateViewportMode = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    updateViewportMode();
    window.addEventListener('resize', updateViewportMode);

    return () => {
      window.removeEventListener('resize', updateViewportMode);
    };
  }, []);

  const syncMobileScrollState = (viewport: HTMLDivElement) => {
    const rawMax = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const rawLeft = viewport.scrollLeft;

    const normalizedLeft =
      rawLeft <= EDGE_TOLERANCE
        ? 0
        : rawLeft >= rawMax - EDGE_TOLERANCE
          ? rawMax
          : rawLeft;

    setMaxOffset(rawMax);
    setOffset(normalizedLeft);
  };

  useLayoutEffect(() => {
    const updateLimits = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!viewport || !track) {
        return;
      }

      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        syncMobileScrollState(viewport);
        return;
      }

      const nextMaxOffset = Math.max(track.scrollWidth - viewport.clientWidth, 0);
      setMaxOffset(nextMaxOffset);
      setOffset((prev) => Math.min(prev, nextMaxOffset));
    };

    updateLimits();

    const resizeObserver = new ResizeObserver(() => {
      updateLimits();
    });

    const viewportElement = viewportRef.current;
    const trackElement = trackRef.current;

    if (viewportElement) {
      resizeObserver.observe(viewportElement);
    }

    if (trackElement) {
      resizeObserver.observe(trackElement);
    }

    window.addEventListener('resize', updateLimits);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateLimits);
    };
  }, [articles]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || !isMobile) {
      return;
    }

    const handleScroll = () => {
      syncMobileScrollState(viewport);
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, articles]);

  const slideStep = isMobile ? MOBILE_SLIDE_STEP : DESKTOP_SLIDE_STEP;

  const handlePrev = () => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    if (isMobile) {
      const targetLeft = Math.max(viewport.scrollLeft - slideStep, 0);

      viewport.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });

      requestAnimationFrame(() => {
        syncMobileScrollState(viewport);
      });

      setTimeout(() => {
        syncMobileScrollState(viewport);
      }, 350);

      return;
    }

    setOffset((prev) => Math.max(prev - slideStep, 0));
  };

  const handleNext = () => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    if (isMobile) {
      const currentMax = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
      const targetLeft = Math.min(viewport.scrollLeft + slideStep, currentMax);

      viewport.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });

      requestAnimationFrame(() => {
        syncMobileScrollState(viewport);
      });

      setTimeout(() => {
        syncMobileScrollState(viewport);
      }, 350);

      return;
    }

    setOffset((prev) => Math.min(prev + slideStep, maxOffset));
  };
  
  const isPrevDisabled = offset <= 2;
  const isNextDisabled = offset >= maxOffset - 2;

  return (
    <section className="news" id="news">
      <div className="container">
        <div className="news__top">
          <div className="news__heading">
            <h2 className="news__title">Current news from the world of finance</h2>
            <p className="news__description">
              We update the news feed every 15 minutes. You can learn more by clicking
              on the news you are interested in.
            </p>
          </div>
        </div>

        {isLoading && <div className="news__state">Loading news...</div>}

        {!isLoading && error && (
          <div className="news__state news__state--error">{error}</div>
        )}

        {!isLoading && !error && articles.length > 0 && (
          <>
            <div className="news__slider" ref={viewportRef}>
              <div
                className="news__track"
                ref={trackRef}
                style={!isMobile ? { transform: `translateX(-${offset}px)` } : undefined}
              >
                {articles.map((article) => (
                  <a
                    key={article.url}
                    className="news-card"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="news-card__image-wrap">
                      <img
                        className="news-card__image"
                        src={article.urlToImage}
                        alt={article.title}
                        loading="lazy"
                      />
                    </div>

                    <div className="news-card__body">
                      <h3 className="news-card__title">{article.title}</h3>
                      <p className="news-card__description">{article.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="news__controls news__controls--bottom">
              <button
                type="button"
                className="news__button"
                onClick={handlePrev}
                disabled={isPrevDisabled}
                aria-label="Previous news"
              >
                <img
                  src={arrowLeft}
                  alt=""
                  className="news__button-icon"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                className="news__button"
                onClick={handleNext}
                disabled={isNextDisabled}
                aria-label="Next news"
              >
                <img
                  src={arrowRight}
                  alt=""
                  className="news__button-icon"
                  aria-hidden="true"
                />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};