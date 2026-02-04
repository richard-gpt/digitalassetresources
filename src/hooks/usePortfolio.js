import { useState, useCallback, useEffect } from 'react';
import {
  getPortfolio,
  savePortfolio,
  addCoinToPortfolio,
  updateCoinQuantity,
  removeCoinFromPortfolio,
} from '../utils/storage';

/**
 * Hook for managing portfolio state
 */
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState([]);

  // Load portfolio on mount
  useEffect(() => {
    const saved = getPortfolio();
    setPortfolio(saved);
  }, []);

  // Add coin to portfolio
  const addCoin = useCallback((coin) => {
    const updated = addCoinToPortfolio(coin);
    setPortfolio([...updated]);
  }, []);

  // Update coin quantity
  const updateQuantity = useCallback((coinId, quantity) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or negative
      const updated = removeCoinFromPortfolio(coinId);
      setPortfolio([...updated]);
    } else {
      const updated = updateCoinQuantity(coinId, quantity);
      setPortfolio([...updated]);
    }
  }, []);

  // Remove coin from portfolio
  const removeCoin = useCallback((coinId) => {
    const updated = removeCoinFromPortfolio(coinId);
    setPortfolio([...updated]);
  }, []);

  // Get coin IDs for price fetching
  const coinIds = portfolio.map(p => p.coinId);

  // Calculate total value (needs prices passed in)
  const calculateTotalValue = useCallback((prices) => {
    return portfolio.reduce((total, coin) => {
      const priceData = prices[coin.coinId];
      if (priceData) {
        return total + (coin.quantity * priceData.price);
      }
      return total;
    }, 0);
  }, [portfolio]);

  // Calculate 24h change (weighted average)
  const calculate24hChange = useCallback((prices) => {
    let totalValue = 0;
    let weightedChange = 0;

    portfolio.forEach(coin => {
      const priceData = prices[coin.coinId];
      if (priceData && priceData.change24h !== null) {
        const coinValue = coin.quantity * priceData.price;
        totalValue += coinValue;
        weightedChange += coinValue * priceData.change24h;
      }
    });

    if (totalValue === 0) return 0;
    return weightedChange / totalValue;
  }, [portfolio]);

  // Clear entire portfolio
  const clearPortfolio = useCallback(() => {
    savePortfolio([]);
    setPortfolio([]);
  }, []);

  return {
    portfolio,
    coinIds,
    addCoin,
    updateQuantity,
    removeCoin,
    clearPortfolio,
    calculateTotalValue,
    calculate24hChange,
  };
}
