import React, { useState } from 'react';
import { formatCurrency, formatPercentage, formatQuantity } from '../utils/formatters';

export default function PortfolioItem({
  coin,
  priceData,
  onUpdateQuantity,
  onRemove,
  onShowChart,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(coin.quantity.toString());

  const price = priceData?.price || 0;
  const change24h = priceData?.change24h || 0;
  const value = coin.quantity * price;
  const isPositive = change24h >= 0;

  const handleSaveQuantity = () => {
    const qty = parseFloat(editQuantity);
    if (!isNaN(qty) && qty > 0) {
      onUpdateQuantity(coin.coinId, qty);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveQuantity();
    } else if (e.key === 'Escape') {
      setEditQuantity(coin.quantity.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-crypto-card border border-crypto-border rounded-lg p-4 hover:border-crypto-muted transition-colors">
      <div className="flex items-center gap-4">
        {/* Coin Icon */}
        <button
          onClick={() => onShowChart(coin)}
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-crypto-accent rounded-full"
        >
          {priceData?.image ? (
            <img
              src={priceData.image}
              alt={coin.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-crypto-border rounded-full flex items-center justify-center text-sm font-bold text-crypto-muted">
              {coin.symbol.slice(0, 2).toUpperCase()}
            </div>
          )}
        </button>

        {/* Coin Info */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onShowChart(coin)}
            className="text-left focus:outline-none"
          >
            <div className="font-medium text-white truncate">{coin.name}</div>
            <div className="text-crypto-muted text-sm uppercase">{coin.symbol}</div>
          </button>
        </div>

        {/* Quantity */}
        <div className="text-right">
          <div className="text-crypto-muted text-xs mb-1">Quantity</div>
          {isEditing ? (
            <input
              type="number"
              step="any"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              onBlur={handleSaveQuantity}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-24 bg-crypto-dark border border-crypto-accent rounded px-2 py-1 text-white text-sm text-right focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white hover:text-crypto-accent transition-colors"
            >
              {formatQuantity(coin.quantity)}
            </button>
          )}
        </div>

        {/* Price */}
        <div className="text-right hidden sm:block">
          <div className="text-crypto-muted text-xs mb-1">Price</div>
          <div className="text-white">{formatCurrency(price)}</div>
        </div>

        {/* Value */}
        <div className="text-right">
          <div className="text-crypto-muted text-xs mb-1">Value</div>
          <div className="text-white font-medium">{formatCurrency(value)}</div>
        </div>

        {/* 24h Change */}
        <div className="text-right hidden sm:block">
          <div className="text-crypto-muted text-xs mb-1">24h</div>
          <div
            className={`font-medium ${
              isPositive ? 'text-crypto-green' : 'text-crypto-red'
            }`}
          >
            {formatPercentage(change24h)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowChart(coin)}
            className="p-2 text-crypto-muted hover:text-crypto-accent transition-colors"
            title="View Chart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </button>
          <button
            onClick={() => onRemove(coin.coinId)}
            className="p-2 text-crypto-muted hover:text-crypto-red transition-colors"
            title="Remove"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
