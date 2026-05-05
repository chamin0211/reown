import { useState } from 'react';
import { Header } from '../components/Header';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { allProducts } from '../data/products';

export function CheckoutPage() {
  const [shippingData, setShippingData] = useState({
    name: '',
    address: '',
    detailedAddress: '',
    phone: '',
    message: 'default',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'simple' | 'transfer'>('card');
  const [pointsToUse, setPointsToUse] = useState(0);

  // Sample order items (using first 2 products)
  const orderItems = allProducts.slice(0, 2).map((product) => ({
    ...product,
    quantity: 1,
    option: 'Size: M / Color: Black',
  }));

  const itemsTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = itemsTotal > 100000 ? 0 : 3000;
  const availablePoints = 5000;
  const finalTotal = itemsTotal + shippingFee - pointsToUse;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setPointsToUse(Math.min(value, availablePoints, itemsTotal));
  };

  const handlePayment = () => {
    console.log('Processing payment:', { shippingData, paymentMethod, pointsToUse, finalTotal });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-12">
          {/* Page Title */}
          <h1 className="text-4xl font-light tracking-wider mb-16" style={{ color: '#101828' }}>
            Checkout
          </h1>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-12 gap-12">
            {/* Left Column - Main Content */}
            <div className="col-span-7 space-y-12">
              {/* Section 1: Shipping Information */}
              <div>
                <h2 className="text-xl font-light tracking-wide mb-6" style={{ color: '#101828' }}>
                  Shipping Information
                </h2>
                <div className="space-y-5">
                  {/* Recipient Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={shippingData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                      style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                      placeholder="Enter recipient name"
                    />
                  </div>

                  {/* Address Search */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                      Address
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingData.address}
                        onChange={handleInputChange}
                        className="flex-1 px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                        style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                        placeholder="Search address"
                        readOnly
                      />
                      <button
                        className="px-6 text-sm font-light tracking-wide transition-opacity hover:opacity-80"
                        style={{ border: '0.5px solid #101828', color: '#101828', height: '52px' }}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Detailed Address */}
                  <div>
                    <label htmlFor="detailedAddress" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                      Detailed Address
                    </label>
                    <input
                      type="text"
                      id="detailedAddress"
                      name="detailedAddress"
                      value={shippingData.detailedAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                      style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                      placeholder="Enter detailed address"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                      style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Shipping Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                      Shipping Message
                    </label>
                    <select
                      id="message"
                      name="message"
                      value={shippingData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                      style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                    >
                      <option value="default">Please ring the doorbell upon delivery</option>
                      <option value="door">Leave at the door</option>
                      <option value="security">Leave with security</option>
                      <option value="call">Please call before delivery</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Order Items */}
              <div>
                <h2 className="text-xl font-light tracking-wide mb-6" style={{ color: '#101828' }}>
                  Order Items
                </h2>
                <div className="space-y-6">
                  {orderItems.map((item, index) => (
                    <div key={item.productId}>
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-28 h-36 bg-gray-50 overflow-hidden">
                          <img
                            src={item.ogImageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1">
                              {item.brandName}
                            </p>
                            <h3 className="text-base font-light mb-2" style={{ color: '#101828' }}>
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-light">{item.option}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-light">Qty: {item.quantity}</span>
                            <p className="text-base font-light" style={{ color: '#101828' }}>
                              ₩{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < orderItems.length - 1 && (
                        <div className="mt-6" style={{ borderBottom: '0.5px solid #e5e7eb' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div>
                <h2 className="text-xl font-light tracking-wide mb-6" style={{ color: '#101828' }}>
                  Payment Method
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {/* Credit/Debit Card */}
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className="p-6 text-center transition-all"
                    style={{
                      border: paymentMethod === 'card' ? '1.5px solid #101828' : '0.5px solid #e5e7eb',
                      backgroundColor: paymentMethod === 'card' ? '#f9fafb' : 'transparent',
                    }}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-3" style={{ color: '#101828' }} />
                    <p className="text-sm font-light" style={{ color: '#101828' }}>
                      Credit/Debit Card
                    </p>
                  </button>

                  {/* Simple Pay */}
                  <button
                    onClick={() => setPaymentMethod('simple')}
                    className="p-6 text-center transition-all"
                    style={{
                      border: paymentMethod === 'simple' ? '1.5px solid #101828' : '0.5px solid #e5e7eb',
                      backgroundColor: paymentMethod === 'simple' ? '#f9fafb' : 'transparent',
                    }}
                  >
                    <Smartphone className="w-8 h-8 mx-auto mb-3" style={{ color: '#101828' }} />
                    <p className="text-sm font-light" style={{ color: '#101828' }}>
                      Simple Pay
                    </p>
                  </button>

                  {/* Bank Transfer */}
                  <button
                    onClick={() => setPaymentMethod('transfer')}
                    className="p-6 text-center transition-all"
                    style={{
                      border: paymentMethod === 'transfer' ? '1.5px solid #101828' : '0.5px solid #e5e7eb',
                      backgroundColor: paymentMethod === 'transfer' ? '#f9fafb' : 'transparent',
                    }}
                  >
                    <Building2 className="w-8 h-8 mx-auto mb-3" style={{ color: '#101828' }} />
                    <p className="text-sm font-light" style={{ color: '#101828' }}>
                      Bank Transfer
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="col-span-5">
              <div className="sticky top-24">
                <div className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
                  <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                    Order Summary
                  </h2>

                  <div className="space-y-5 mb-8">
                    {/* Items Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-gray-600">Items Price</span>
                      <span className="text-sm font-light" style={{ color: '#101828' }}>
                        ₩{itemsTotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Shipping Fee */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-gray-600">Shipping Fee</span>
                      <span className="text-sm font-light" style={{ color: '#101828' }}>
                        {shippingFee === 0 ? 'Free' : `₩${shippingFee.toLocaleString()}`}
                      </span>
                    </div>

                    {/* Point Usage */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-light text-gray-600">Point Usage</span>
                        <span className="text-xs font-light text-gray-500">
                          Available: {availablePoints.toLocaleString()}P
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={pointsToUse || ''}
                          onChange={handlePointsChange}
                          className="flex-1 px-3 text-sm text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                          style={{ border: '0.5px solid #d1d5db', height: '44px' }}
                          placeholder="Enter points"
                          min="0"
                          max={availablePoints}
                        />
                        <button
                          onClick={() => setPointsToUse(Math.min(availablePoints, itemsTotal))}
                          className="px-4 text-xs font-light tracking-wide transition-opacity hover:opacity-80"
                          style={{ border: '0.5px solid #101828', color: '#101828' }}
                        >
                          Use All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div
                    className="flex items-center justify-between py-6 mb-8"
                    style={{ borderTop: '0.5px solid #e5e7eb', borderBottom: '0.5px solid #e5e7eb' }}
                  >
                    <span className="text-base font-medium" style={{ color: '#101828' }}>
                      Total Amount
                    </span>
                    <span className="text-2xl font-medium" style={{ color: '#101828' }}>
                      ₩{finalTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    className="w-full text-sm text-white font-medium tracking-widest transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#101828', height: '64px' }}
                  >
                    PAY ₩{finalTotal.toLocaleString()} NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
