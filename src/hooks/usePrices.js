import { useState, useEffect, useCallback, useRef } from 'react';
import { getMarketData, getHistoricalData } from '../utils/api';

/**
 * Hook for fetching and polling prices
 * @param {string[]} coinIds - Array of coin IDs to fetch prices for
 * @param {number} pollInterval - Polling interval in ms (default: 60000)
 */
export function usePrices(coinIds, pollInterval = 60000) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Fetch prices
  const fetchPrices = useCallback(async () => {
    if (!coinIds || coinIds.length === 0) {
      setPrices({});
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getMarketData(coinIds);

      // Transform to object keyed by coin ID
      const priceMap = {};
      data.forEach(coin => {
        priceMap[coin.id] = {
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          volume: coin.total_volume,
          image: coin.image,
          high24h: coin.high_24h,
          low24h: coin.low_24h,
        };
      });

      setPrices(priceMap);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch prices. Will retry...');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  }, [coinIds]);

  // Initial fetch and polling
  useEffect(() => {
    fetchPrices();

    // Set up polling
    if (pollInterval > 0) {
      intervalRef.current = setInterval(fetchPrices, pollInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPrices, pollInterval]);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refresh,
  };
}

/**
 * Hook for fetching historical price data for charts
 * @param {string} coinId - Coin ID
 * @param {number} days - Number of days
 */
export function useHistoricalPrices(coinId, days = 7) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) {
      setData([]);
      return;
    }

    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const historical = await getHistoricalData(coinId, days);
        if (mounted) {
          setData(historical);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load chart data');
          console.error('Error fetching historical data:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [coinId, days]);

  return { data, loading, error };
}
