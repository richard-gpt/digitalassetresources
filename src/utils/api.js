import axios from 'axios';
import { getCachedCoinList, cacheCoinList } from './storage';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Simple rate limiting - track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1500; // 1.5 seconds between requests

async function rateLimitedRequest(url, params = {}) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      // Rate limited - wait and retry once
      await new Promise(resolve => setTimeout(resolve, 60000));
      const response = await axios.get(url, { params });
      return response.data;
    }
    throw error;
  }
}

/**
 * Get list of all coins (id, symbol, name)
 * Uses cache to avoid repeated API calls
 */
export async function getCoinList() {
  // Check cache first
  const cached = getCachedCoinList();
  if (cached) {
    return cached.coins;
  }

  const data = await rateLimitedRequest(`${BASE_URL}/coins/list`);

  // Cache the result
  cacheCoinList(data);

  return data;
}

/**
 * Get market data for specific coins
 * @param {string[]} coinIds - Array of coin IDs
 */
export async function getMarketData(coinIds) {
  if (!coinIds || coinIds.length === 0) {
    return [];
  }

  const data = await rateLimitedRequest(`${BASE_URL}/coins/markets`, {
    vs_currency: 'usd',
    ids: coinIds.join(','),
    order: 'market_cap_desc',
    per_page: 250,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h',
  });

  return data;
}

/**
 * Get historical price data for a coin
 * @param {string} coinId - Coin ID
 * @param {number} days - Number of days (1, 7, 30, 90, 365)
 */
export async function getHistoricalData(coinId, days = 7) {
  const data = await rateLimitedRequest(
    `${BASE_URL}/coins/${coinId}/market_chart`,
    {
      vs_currency: 'usd',
      days: days,
    }
  );

  // Transform data for charts
  return data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toLocaleDateString(),
  }));
}

/**
 * Get trending coins
 */
export async function getTrendingCoins() {
  const data = await rateLimitedRequest(`${BASE_URL}/search/trending`);
  return data.coins.map(item => item.item);
}

/**
 * Search coins by query
 * This is a client-side filter since CoinGecko's search endpoint
 * has stricter rate limits
 * @param {Array} coinList - Full coin list
 * @param {string} query - Search query
 * @param {number} limit - Max results
 */
export function searchCoins(coinList, query, limit = 20) {
  if (!query || query.length < 1) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  // Score and sort results
  const scored = coinList
    .map(coin => {
      const symbolMatch = coin.symbol.toLowerCase() === lowerQuery;
      const symbolStartsWith = coin.symbol.toLowerCase().startsWith(lowerQuery);
      const nameStartsWith = coin.name.toLowerCase().startsWith(lowerQuery);
      const nameContains = coin.name.toLowerCase().includes(lowerQuery);
      const symbolContains = coin.symbol.toLowerCase().includes(lowerQuery);

      let score = 0;
      if (symbolMatch) score = 100;
      else if (symbolStartsWith) score = 80;
      else if (nameStartsWith) score = 60;
      else if (symbolContains) score = 40;
      else if (nameContains) score = 20;

      return { ...coin, score };
    })
    .filter(coin => coin.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
