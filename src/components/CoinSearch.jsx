import React, { useState, useRef, useEffect } from 'react';

export default function CoinSearch({
  searchResults,
  searchQuery,
  onSearch,
  onSelectCoin,
  loading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    onSearch(value);
    setIsOpen(value.length > 0);
  };

  const handleSelectCoin = (coin) => {
    onSelectCoin(coin);
    onSearch('');
    setIsOpen(false);
    inputRef.current.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current.blur();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search coins to add (e.g., BTC, Ethereum)..."
          className="w-full bg-crypto-dark border border-crypto-border rounded-lg px-4 py-3 pl-10 text-crypto-text placeholder-crypto-muted focus:outline-none focus:border-crypto-accent transition-colors"
          onChange={handleInputChange}
          onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-crypto-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-crypto-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-crypto-card border border-crypto-border rounded-lg shadow-xl max-h-80 overflow-y-auto"
        >
          {searchResults.map((coin) => (
            <button
              key={coin.id}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-crypto-dark transition-colors text-left border-b border-crypto-border last:border-b-0"
              onClick={() => handleSelectCoin(coin)}
            >
              <div className="w-8 h-8 bg-crypto-border rounded-full flex items-center justify-center text-xs font-bold text-crypto-muted">
                {coin.symbol.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {coin.name}
                </div>
                <div className="text-crypto-muted text-sm uppercase">
                  {coin.symbol}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && searchQuery.length > 0 && searchResults.length === 0 && !loading && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-crypto-card border border-crypto-border rounded-lg shadow-xl p-4 text-center text-crypto-muted"
        >
          No coins found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
