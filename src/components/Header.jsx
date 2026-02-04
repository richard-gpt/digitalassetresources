import React from 'react';

export default function Header({ lastUpdated }) {
  return (
    <header className="bg-crypto-card border-b border-crypto-border">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crypto-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">$</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Digital Asset Resources
              </h1>
              <p className="text-crypto-muted text-sm">
                Crypto Portfolio Tracker
              </p>
            </div>
          </div>

          {lastUpdated && (
            <div className="text-crypto-muted text-sm hidden sm:block">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
