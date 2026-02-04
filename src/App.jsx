import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CoinSearch from './components/CoinSearch';
import AddCoinModal from './components/AddCoinModal';
import PortfolioSummary from './components/PortfolioSummary';
import Portfolio from './components/Portfolio';
import PriceChart from './components/PriceChart';
import { useCoins } from './hooks/useCoins';
import { usePrices } from './hooks/usePrices';
import { usePortfolio } from './hooks/usePortfolio';

function App() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartCoin, setChartCoin] = useState(null);

  // Hooks
  const {
    loading: coinsLoading,
    searchResults,
    searchQuery,
    search,
  } = useCoins();

  const {
    portfolio,
    coinIds,
    addCoin,
    updateQuantity,
    removeCoin,
    calculateTotalValue,
    calculate24hChange,
  } = usePortfolio();

  const {
    prices,
    loading: pricesLoading,
    lastUpdated,
  } = usePrices(coinIds, 60000);

  // Calculations
  const totalValue = useMemo(
    () => calculateTotalValue(prices),
    [calculateTotalValue, prices]
  );

  const change24h = useMemo(
    () => calculate24hChange(prices),
    [calculate24hChange, prices]
  );

  // Handlers
  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
  };

  const handleAddCoin = (coinData) => {
    addCoin(coinData);
    setSelectedCoin(null);
  };

  const handleShowChart = (coin) => {
    setChartCoin(coin);
  };

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Header lastUpdated={lastUpdated} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-8">
          <CoinSearch
            searchResults={searchResults}
            searchQuery={searchQuery}
            onSearch={search}
            onSelectCoin={handleSelectCoin}
            loading={coinsLoading}
          />
        </section>

        {/* Portfolio Summary */}
        {portfolio.length > 0 && (
          <section className="mb-8">
            <PortfolioSummary
              totalValue={totalValue}
              change24h={change24h}
              coinCount={portfolio.length}
            />
          </section>
        )}

        {/* Portfolio List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Portfolio</h2>
            {pricesLoading && (
              <div className="flex items-center gap-2 text-crypto-muted text-sm">
                <div className="w-4 h-4 border-2 border-crypto-accent border-t-transparent rounded-full animate-spin" />
                Updating prices...
              </div>
            )}
          </div>
          <Portfolio
            portfolio={portfolio}
            prices={prices}
            onUpdateQuantity={updateQuantity}
            onRemove={removeCoin}
            onShowChart={handleShowChart}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-crypto-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-crypto-muted text-sm">
          <p>Data provided by CoinGecko API. Prices update every 60 seconds.</p>
          <p className="mt-1">
            Portfolio data is stored locally in your browser.
          </p>
        </div>
      </footer>

      {/* Add Coin Modal */}
      {selectedCoin && (
        <AddCoinModal
          coin={selectedCoin}
          onAdd={handleAddCoin}
          onClose={() => setSelectedCoin(null)}
        />
      )}

      {/* Price Chart Modal */}
      {chartCoin && (
        <PriceChart
          coin={chartCoin}
          priceData={prices[chartCoin.coinId]}
          onClose={() => setChartCoin(null)}
        />
      )}
    </div>
  );
}

export default App;
