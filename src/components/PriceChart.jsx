import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useHistoricalPrices } from '../hooks/usePrices';
import { formatCurrency, formatChartDate } from '../utils/formatters';

const TIME_RANGES = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

export default function PriceChart({ coin, priceData, onClose }) {
  const [selectedRange, setSelectedRange] = useState(7);
  const { data, loading, error, retry } = useHistoricalPrices(coin.coinId, selectedRange);

  const priceChange = data.length > 1
    ? ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
    : 0;
  const isPositive = priceChange >= 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-crypto-card border border-crypto-border rounded-lg p-3 shadow-lg">
          <p className="text-crypto-muted text-sm">
            {new Date(payload[0].payload.timestamp).toLocaleString()}
          </p>
          <p className="text-white font-medium">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-crypto-card border border-crypto-border rounded-xl w-full max-w-3xl shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
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
              <div>
                <h2 className="text-xl font-bold text-white">{coin.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-crypto-muted uppercase">{coin.symbol}</span>
                  {priceData && (
                    <span className="text-white font-medium">
                      {formatCurrency(priceData.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-crypto-muted hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-6">
            {TIME_RANGES.map((range) => (
              <button
                key={range.days}
                onClick={() => setSelectedRange(range.days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRange === range.days
                    ? 'bg-crypto-accent text-white'
                    : 'bg-crypto-dark text-crypto-muted hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-64 mb-4">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-2 border-crypto-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-crypto-muted text-sm">Loading chart data...</span>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <svg className="w-12 h-12 text-crypto-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-crypto-muted text-sm text-center max-w-xs">{error}</p>
                <button
                  onClick={retry}
                  className="px-4 py-2 bg-crypto-accent text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isPositive ? '#3fb950' : '#f85149'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={isPositive ? '#3fb950' : '#f85149'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(ts) => formatChartDate(ts)}
                    stroke="#8b949e"
                    tick={{ fill: '#8b949e', fontSize: 12 }}
                    axisLine={{ stroke: '#30363d' }}
                    tickLine={{ stroke: '#30363d' }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => formatCurrency(val, 0)}
                    stroke="#8b949e"
                    tick={{ fill: '#8b949e', fontSize: 12 }}
                    axisLine={{ stroke: '#30363d' }}
                    tickLine={{ stroke: '#30363d' }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#3fb950' : '#f85149'}
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Stats */}
          {priceData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-crypto-muted text-xs mb-1">24h Change</div>
                <div
                  className={`font-medium ${
                    priceData.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                  }`}
                >
                  {priceData.change24h?.toFixed(2)}%
                </div>
              </div>
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-crypto-muted text-xs mb-1">24h High</div>
                <div className="text-white font-medium">
                  {formatCurrency(priceData.high24h)}
                </div>
              </div>
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-crypto-muted text-xs mb-1">24h Low</div>
                <div className="text-white font-medium">
                  {formatCurrency(priceData.low24h)}
                </div>
              </div>
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-crypto-muted text-xs mb-1">Market Cap</div>
                <div className="text-white font-medium">
                  {formatCurrency(priceData.marketCap, 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
