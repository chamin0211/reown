import { Heart } from 'lucide-react';
import { useState } from 'react';
import { allProducts } from '../data/products';
import { Header } from '../components/Header';

export function WishlistPage() {
  // Sample wishlist items - using first 12 products
  const [wishlistItems, setWishlistItems] = useState(allProducts.slice(0, 12));
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedItems.size === wishlistItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(wishlistItems.map((item) => item.productId)));
    }
  };

  const deleteSelected = () => {
    setWishlistItems(wishlistItems.filter((item) => !selectedItems.has(item.productId)));
    setSelectedItems(new Set());
  };

  const toggleItemSelection = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.productId !== productId));
    const newSelected = new Set(selectedItems);
    newSelected.delete(productId);
    setSelectedItems(newSelected);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-[1400px] mx-auto px-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-16 pb-10" style={{ borderBottom: '0.5px solid #d1d5db' }}>
            <h1 className="text-5xl font-light tracking-wider text-gray-900">
              WISH <span className="text-3xl text-gray-400">({wishlistItems.length})</span>
            </h1>
            <div className="flex items-center gap-8">
              <button
                onClick={toggleSelectAll}
                className="text-sm font-light text-gray-600 hover:text-blue-900 transition-colors tracking-wide"
              >
                {selectedItems.size === wishlistItems.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={deleteSelected}
                disabled={selectedItems.size === 0}
                className="text-sm font-light text-gray-600 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed tracking-wide"
              >
                Delete
              </button>
            </div>
          </div>

          {/* 4-Column Grid */}
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-4 gap-10">
              {wishlistItems.map((product) => (
                <div key={product.productId} className="group flex flex-col h-full">
                  {/* Product Card */}
                  <div className="relative mb-5">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                      <img
                        src={product.ogImageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Heart Icon - Top Right */}
                      <button
                        onClick={() => removeFromWishlist(product.productId)}
                        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                      >
                        <Heart className="w-5 h-5" style={{ fill: '#1e3a8a', color: '#1e3a8a' }} />
                      </button>

                      {/* Selection Checkbox */}
                      <div className="absolute top-5 left-5">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(product.productId)}
                          onChange={() => toggleItemSelection(product.productId)}
                          className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                          style={{ accentColor: '#1e3a8a' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2 mb-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-light truncate">{product.brandName}</p>
                    <h3 className="text-sm text-gray-900 font-light truncate">{product.name}</h3>
                    <p className="text-sm text-gray-900 font-light">₩{product.price.toLocaleString()}</p>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="w-full py-3 text-xs text-gray-900 hover:bg-gray-50 transition-colors tracking-widest font-light mt-auto"
                    style={{ border: '0.5px solid #d1d5db' }}
                  >
                    ADD TO CART
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-gray-400 text-xl font-light tracking-wide">Your wishlist is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
