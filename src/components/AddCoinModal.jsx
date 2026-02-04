import React, { useState, useEffect, useRef } from 'react';

export default function AddCoinModal({ coin, onAdd, onClose }) {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when modal opens
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity greater than 0');
      return;
    }

    onAdd({
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      quantity: qty,
    });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-crypto-card border border-crypto-border rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add to Portfolio</h2>
            <button
              onClick={onClose}
              className="text-crypto-muted hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Coin Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-crypto-dark rounded-lg">
            <div className="w-12 h-12 bg-crypto-border rounded-full flex items-center justify-center text-lg font-bold text-crypto-accent">
              {coin.symbol.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-white text-lg">{coin.name}</div>
              <div className="text-crypto-muted uppercase">{coin.symbol}</div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-crypto-muted text-sm mb-2">
                Quantity
              </label>
              <input
                ref={inputRef}
                id="quantity"
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError('');
                }}
                className="w-full bg-crypto-dark border border-crypto-border rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-crypto-accent transition-colors"
              />
              {error && (
                <p className="mt-2 text-crypto-red text-sm">{error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-crypto-dark text-crypto-muted rounded-lg hover:bg-crypto-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-crypto-accent text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add to Portfolio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
