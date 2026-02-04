import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export default function PortfolioSummary({ totalValue, change24h, coinCount }) {
  const isPositive = change24h >= 0;

  return (
    <div className="bg-crypto-card border border-crypto-border rounded-xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Value */}
        <div>
          <div className="text-crypto-muted text-sm mb-1">Total Portfolio Value</div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(totalValue)}
          </div>
        </div>

        {/* 24h Change */}
        <div>
          <div className="text-crypto-muted text-sm mb-1">24h Change</div>
          <div
            className={`text-2xl font-bold ${
              isPositive ? 'text-crypto-green' : 'text-crypto-red'
            }`}
          >
            {formatPercentage(change24h)}
          </div>
        </div>

        {/* Coin Count */}
        <div>
          <div className="text-crypto-muted text-sm mb-1">Assets</div>
          <div className="text-2xl font-bold text-white">
            {coinCount} {coinCount === 1 ? 'coin' : 'coins'}
          </div>
        </div>
      </div>
    </div>
  );
}
