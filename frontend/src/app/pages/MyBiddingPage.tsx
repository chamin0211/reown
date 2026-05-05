import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Clock, Circle } from 'lucide-react';
import { allProducts } from '../data/products';

interface BidItem {
  bidId: string;
  product: typeof allProducts[0];
  yourBid: number;
  currentPrice: number;
  isHighestBidder: boolean;
  endTime: Date;
  bidCount: number;
}

export function MyBiddingPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample bidding data
  const bids: BidItem[] = [
    {
      bidId: 'BID-2024-001',
      product: allProducts[0],
      yourBid: 880000,
      currentPrice: 880000,
      isHighestBidder: true,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000 + 30 * 1000), // 2h 15m 30s
      bidCount: 12,
    },
    {
      bidId: 'BID-2024-002',
      product: allProducts[1],
      yourBid: 1150000,
      currentPrice: 1200000,
      isHighestBidder: false,
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000 + 42 * 60 * 1000), // 5h 42m
      bidCount: 24,
    },
    {
      bidId: 'BID-2024-003',
      product: allProducts[2],
      yourBid: 650000,
      currentPrice: 650000,
      isHighestBidder: true,
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000 + 8 * 60 * 1000), // 1h 8m
      bidCount: 8,
    },
  ];

  const getCountdown = (endTime: Date) => {
    const diff = endTime.getTime() - currentTime.getTime();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-12">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-light tracking-wider mb-3" style={{ color: '#101828' }}>
              Bidding Status
            </h1>
            <p className="text-sm font-light text-gray-500">
              {bids.filter(b => b.isHighestBidder).length} active bids • {bids.length} total
            </p>
          </div>

          {/* Bidding Items */}
          {bids.length === 0 ? (
            <div className="text-center py-20">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-light mb-2" style={{ color: '#101828' }}>
                No active bids
              </h3>
              <p className="text-gray-500 font-light">
                Start bidding on items you're interested in
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bids.map((bid) => {
                const countdown = getCountdown(bid.endTime);
                const isUrgent = countdown.hours === 0 && countdown.minutes < 30;

                return (
                  <div
                    key={bid.bidId}
                    className="p-8"
                    style={{
                      border: `0.5px solid ${isUrgent ? '#fecaca' : '#e5e7eb'}`,
                      backgroundColor: isUrgent ? '#fef2f2' : 'white',
                    }}
                  >
                    <div className="flex gap-8">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-32 h-40 bg-gray-50 overflow-hidden">
                        <img
                          src={bid.product.ogImageUrl}
                          alt={bid.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Bid Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Product Info & Status */}
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1 truncate">
                                {bid.product.brandName}
                              </p>
                              <h3 className="text-lg font-light mb-2 truncate" style={{ color: '#101828' }}>
                                {bid.product.name}
                              </h3>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: bid.isHighestBidder ? '#f0fdf4' : '#fef2f2', border: `0.5px solid ${bid.isHighestBidder ? '#86efac' : '#fecaca'}` }}>
                              <Circle
                                className="w-2 h-2"
                                style={{
                                  fill: bid.isHighestBidder ? '#16a34a' : '#dc2626',
                                  color: bid.isHighestBidder ? '#16a34a' : '#dc2626',
                                }}
                              />
                              <span
                                className="text-sm font-light"
                                style={{ color: bid.isHighestBidder ? '#16a34a' : '#dc2626' }}
                              >
                                {bid.isHighestBidder ? 'Highest Bidder' : 'Outbid'}
                              </span>
                            </div>
                          </div>

                          {/* Countdown Timer */}
                          <div className="flex items-center gap-3 mb-4">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span
                                  className="text-2xl font-light tabular-nums"
                                  style={{ color: isUrgent ? '#dc2626' : '#101828' }}
                                >
                                  {formatTime(countdown.hours)}
                                </span>
                                <span className="text-sm font-light text-gray-500">h</span>
                              </div>
                              <span className="text-lg font-light text-gray-400">:</span>
                              <div className="flex items-center gap-1">
                                <span
                                  className="text-2xl font-light tabular-nums"
                                  style={{ color: isUrgent ? '#dc2626' : '#101828' }}
                                >
                                  {formatTime(countdown.minutes)}
                                </span>
                                <span className="text-sm font-light text-gray-500">m</span>
                              </div>
                              <span className="text-lg font-light text-gray-400">:</span>
                              <div className="flex items-center gap-1">
                                <span
                                  className="text-2xl font-light tabular-nums"
                                  style={{ color: isUrgent ? '#dc2626' : '#101828' }}
                                >
                                  {formatTime(countdown.seconds)}
                                </span>
                                <span className="text-sm font-light text-gray-500">s</span>
                              </div>
                            </div>
                          </div>

                          {/* Bid Info */}
                          <div className="flex items-center gap-8 text-sm font-light">
                            <div>
                              <span className="text-gray-500">Current Price:</span>{' '}
                              <span className="font-medium" style={{ color: '#101828' }}>
                                ₩{bid.currentPrice.toLocaleString()}
                              </span>
                            </div>
                            <div style={{ width: '0.5px', height: '14px', backgroundColor: '#d1d5db' }} />
                            <div>
                              <span className="text-gray-500">Your Bid:</span>{' '}
                              <span className="font-medium" style={{ color: bid.isHighestBidder ? '#16a34a' : '#dc2626' }}>
                                ₩{bid.yourBid.toLocaleString()}
                              </span>
                            </div>
                            <div style={{ width: '0.5px', height: '14px', backgroundColor: '#d1d5db' }} />
                            <div>
                              <span className="text-gray-500">Total Bids:</span>{' '}
                              <span style={{ color: '#101828' }}>{bid.bidCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 flex items-end">
                        {!bid.isHighestBidder && (
                          <button
                            className="px-8 py-4 text-sm text-white font-medium tracking-wide transition-opacity hover:opacity-90"
                            style={{ backgroundColor: '#101828' }}
                          >
                            Update Bid
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
