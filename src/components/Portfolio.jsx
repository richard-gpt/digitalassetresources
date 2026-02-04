import React from 'react';
import PortfolioItem from './PortfolioItem';

export default function Portfolio({
  portfolio,
  prices,
  onUpdateQuantity,
  onRemove,
  onShowChart,
}) {
  if (portfolio.length === 0) {
    return (
      <div className="bg-crypto-card border border-crypto-border border-dashed rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-crypto-dark rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-crypto-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Your portfolio is empty
        </h3>
        <p className="text-crypto-muted">
          Search for coins above to start building your portfolio
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {portfolio.map((coin) => (
        <PortfolioItem
          key={coin.coinId}
          coin={coin}
          priceData={prices[coin.coinId]}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          onShowChart={onShowChart}
        />
      ))}
    </div>
  );
}
