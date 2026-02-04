import { useState, useEffect, useCallback } from 'react';
import { getCoinList, searchCoins } from '../utils/api';

/**
 * Hook for managing coin list and search
 */
export function useCoins() {
  const [coinList, setCoinList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch coin list on mount
  useEffect(() => {
    let mounted = true;

    async function fetchCoins() {
      try {
        setLoading(true);
        setError(null);
        const coins = await getCoinList();
        if (mounted) {
          setCoinList(coins);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load coin list. Please try again later.');
          console.error('Error fetching coins:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchCoins();

    return () => {
      mounted = false;
    };
  }, []);

  // Search coins when query changes
  const search = useCallback(
    query => {
      setSearchQuery(query);
      if (!query || query.length < 1) {
        setSearchResults([]);
        return;
      }
      const results = searchCoins(coinList, query, 20);
      setSearchResults(results);
    },
    [coinList]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    coinList,
    loading,
    error,
    searchResults,
    searchQuery,
    search,
    clearSearch,
  };
}
