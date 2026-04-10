import { useCallback, useEffect, useMemo, useState } from 'react';

import bankIcon from '@/shared/assets/images/bank.svg';
import { getLatestRates, type CurrencyCode } from '@/shared/api/exchange-api';
import { Container } from '@/shared/ui/container/container';

import './exchange.scss';

type CurrencyItem = {
  code: CurrencyCode;
  value: number;
};

const REFRESH_INTERVAL = 15 * 60 * 1000;

const CURRENCIES: CurrencyCode[] = ['USD', 'CNY', 'CHF', 'EUR', 'JPY', 'GBP'];

const formatRate = (value: number) => value.toFixed(2);

const splitIntoRows = <T,>(items: T[], size: number) => {
  const rows: T[][] = [];

  items.forEach((item, index) => {
    if (index % size === 0) {
      rows.push([]);
    }

    rows[rows.length - 1].push(item);
  });

  return rows;
};

export const Exchange = () => {
  const [rates, setRates] = useState<CurrencyItem[]>(
    CURRENCIES.map((code) => ({ code, value: 0 }))
  );
  const [updatedText, setUpdatedText] = useState('Update every 15 minutes');
  const [status, setStatus] = useState('Loading exchange rates...');
  const [isLoading, setIsLoading] = useState(false);

  const rows = useMemo(() => splitIntoRows(rates, 3), [rates]);

  const loadRates = useCallback(async () => {
    try {
      setIsLoading(true);
      setStatus('Loading exchange rates...');

   const data = await getLatestRates('RUB', CURRENCIES);
   const nextRates = CURRENCIES.map((code) => ({
  code,
  value: data.rates[code] ? 1 / data.rates[code] : 0,
}));

      setRates(nextRates);
      setUpdatedText(`Update every 15 minutes, ${data.date ?? ''}`);
      setStatus('Rates updated successfully.');
    } catch (error) {
      console.error(error);
      setStatus('Failed to load exchange rates.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRates();

    const timer = window.setInterval(() => {
      void loadRates();
    }, REFRESH_INTERVAL);

    return () => {
      window.clearInterval(timer);
    };
  }, [loadRates]);

  return (
    <section className="exchange" id="exchange">
      <Container>
        <div className="exchange__card">
          <div className="exchange__header">
            <h2 className="exchange__title">Exchange rate in internet bank</h2>
            <p className="exchange__updated">{updatedText}</p>
          </div>

          <p className="exchange__label">Currency</p>

          <div className="exchange__content">
            <div className="exchange__table">
              {rows.map((row, rowIndex) => (
                <div className="exchange__row" key={rowIndex}>
                  {row.map((item) => (
                    <div className="exchange__cell" key={item.code}>
                      <span className="exchange__code">{item.code}:</span>
                      <span className="exchange__value">
                        {formatRate(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <img className="exchange__icon" src={bankIcon} alt="Bank icon" />
          </div>

          <div className="exchange__footer">
            <a className="exchange__link" href="/">
              All courses
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};