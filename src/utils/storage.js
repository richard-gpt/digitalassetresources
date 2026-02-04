const PORTFOLIO_KEY = 'crypto_portfolio';
const COIN_CACHE_KEY = 'coin_list_cache';
const COIN_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get portfolio from localStorage
 * @returns {Array<{coinId: string, symbol: string, name: string, quantity: number}>}
 */
export function getPortfolio() {
  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading portfolio from localStorage:', error);
    return [];
  }
}

/**
 * Save portfolio to localStorage
 * @param {Array} portfolio
 */
export function savePortfolio(portfolio) {
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  } catch (error) {
    console.error('Error saving portfolio to localStorage:', error);
  }
}

/**
 * Add a coin to portfolio
 * @param {{coinId: string, symbol: string, name: string, quantity: number}} coin
 */
export function addCoinToPortfolio(coin) {
  const portfolio = getPortfolio();
  const existingIndex = portfolio.findIndex(p => p.coinId === coin.coinId);

  if (existingIndex >= 0) {
    // Update existing coin quantity
    portfolio[existingIndex].quantity += coin.quantity;
  } else {
    // Add new coin
    portfolio.push(coin);
  }

  savePortfolio(portfolio);
  return portfolio;
}

/**
 * Update coin quantity in portfolio
 * @param {string} coinId
 * @param {number} quantity
 */
export function updateCoinQuantity(coinId, quantity) {
  const portfolio = getPortfolio();
  const index = portfolio.findIndex(p => p.coinId === coinId);

  if (index >= 0) {
    portfolio[index].quantity = quantity;
    savePortfolio(portfolio);
  }

  return portfolio;
}

/**
 * Remove coin from portfolio
 * @param {string} coinId
 */
export function removeCoinFromPortfolio(coinId) {
  const portfolio = getPortfolio();
  const filtered = portfolio.filter(p => p.coinId !== coinId);
  savePortfolio(filtered);
  return filtered;
}

/**
 * Get cached coin list
 * @returns {{coins: Array, timestamp: number} | null}
 */
export function getCachedCoinList() {
  try {
    const data = localStorage.getItem(COIN_CACHE_KEY);
    if (!data) return null;

    const cached = JSON.parse(data);
    const now = Date.now();

    // Check if cache is expired
    if (now - cached.timestamp > COIN_CACHE_EXPIRY) {
      localStorage.removeItem(COIN_CACHE_KEY);
      return null;
    }

    return cached;
  } catch (error) {
    console.error('Error reading coin cache:', error);
    return null;
  }
}

/**
 * Cache coin list
 * @param {Array} coins
 */
export function cacheCoinList(coins) {
  try {
    const data = {
      coins,
      timestamp: Date.now(),
    };
    localStorage.setItem(COIN_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching coin list:', error);
  }
}

/**
 * Clear all data
 */
export function clearAllData() {
  localStorage.removeItem(PORTFOLIO_KEY);
  localStorage.removeItem(COIN_CACHE_KEY);
}
