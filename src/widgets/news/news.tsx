import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getTopBusinessNews, type NewsArticle } from '@/shared/api/news-api';
import arrowLeft from '@/shared/assets/images/arrow-left.svg';
import arrowRight from '@/shared/assets/images/arrow-right.svg';
import './news.scss';

const SLIDE_STEP = 500;

export const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

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

  useLayoutEffect(() => {
    const updateMaxOffset = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!viewport || !track) {
        return;
      }

      const nextMaxOffset = Math.max(track.scrollWidth - viewport.clientWidth, 0);

      setMaxOffset(nextMaxOffset);
      setOffset((prev) => Math.min(prev, nextMaxOffset));
    };

    updateMaxOffset();

    const resizeObserver = new ResizeObserver(() => {
      updateMaxOffset();
    });

    const viewportElement = viewportRef.current;
    const trackElement = trackRef.current;

    if (viewportElement) {
      resizeObserver.observe(viewportElement);
    }

    if (trackElement) {
      resizeObserver.observe(trackElement);
    }

    window.addEventListener('resize', updateMaxOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMaxOffset);
    };
  }, [articles]);

  const handlePrev = () => {
    setOffset((prev) => Math.max(prev - SLIDE_STEP, 0));
  };

  const handleNext = () => {
    setOffset((prev) => Math.min(prev + SLIDE_STEP, maxOffset));
  };

  const isPrevDisabled = offset <= 0;
  const isNextDisabled = offset >= maxOffset;

  return (
    <section className="news" id="news">
      <div className="container">
        <div className="news__top">
          <div className="news__heading">
            <h2 className="news__title">Current news from the world of finance</h2>
            <p className="news__description">We update the news feed every 15 minutes. You can learn more by clicking on the news you are interested in.</p>
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
                style={{ transform: `translateX(-${offset}px)` }}
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