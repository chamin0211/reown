import { useState } from 'react';
import { Header } from '../components/Header';
import { CreditCard, Smartphone, Building2, Calendar, TrendingUp } from 'lucide-react';
import { allProducts } from '../data/products';

export function FundingCheckoutPage() {
  const [shippingData, setShippingData] = useState({
    name: '',
    address: '',
    detailedAddress: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'simple' | 'transfer'>('card');
  const [pointsToUse, setPointsToUse] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Sample funding product
  const fundingProduct = {
    ...allProducts[0],
    fundingPrice: 850000,
    expectedShipping: 'October 20, 2026',
    fundingProgress: 85,
    fundingStatus: 'Project Success Guaranteed',
  };

  const fundingAmount = fundingProduct.fundingPrice;
  const shippingFee = 0; // Free shipping for funding
  const availablePoints = 5000;
  const finalTotal = fundingAmount + shippingFee - pointsToUse;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setPointsToUse(Math.min(value, availablePoints, fundingAmount));
  };

  const handleFunding = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms of participation');
      return;
    }
    console.log('Processing funding:', { shippingData, paymentMethod, pointsToUse, finalTotal });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-12">
          {/* Page Title */}
          <h1 className="text-4xl font-light tracking-wider mb-16" style={{ color: '#101828' }}>
            Funding Checkout
          </h1>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-12 gap-12">
            {/* Left Column - Main Content */}
            <div className="col-span-7 space-y-12">
              {/* Order Item - Funding Product */}
              <div>
                <h2 className="text-xl font-light tracking-wide mb-6" style={{ color: '#101828' }}>
                  Funding Product
                </h2>

                <div className="flex gap-8">
                  {/* Larger Product Image for Funding */}
                  <div className="flex-shrink-0 w-48 h-64 bg-gray-50 overflow-hidden">
                    <img
                      src={fundingProduct.ogImageUrl}
                      alt={fundingProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand Name */}
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-2">
                        {fundingProduct.brandName}
                      </p>

                      {/* Product Name */}
                      <h3 className="text-xl font-light mb-4" style={{ color: '#101828' }}>
                        {fundingProduct.name}
                      </h3>

                      {/* Funding Status Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 mb-4" style={{ backgroundColor: '#f0f9ff', border: '0.5px solid #101828' }}>
                        <TrendingUp className="w-4 h-4" style={{ color: '#101828' }} />
                        <span className="text-sm font-light" style={{ color: '#101828' }}>
                          {fundingProduct.fundingStatus}
                        </span>
                      </div>

                      {/* Expected Shipping Date */}
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 font-light">Estimated Shipping</p>
                          <p className="text-sm font-light" style={{ color: '#101828' }}>
                            {fundingProduct.expectedShipping}
                          </p>
                        </div>
                      </div>

                      {/* Funding Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 font-light">Funding Progress</span>
                          <span className="text-sm font-light" style={{ color: '#101828' }}>
                            {fundingProduct.fundingProgress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${fundingProduct.fundingProgress}%`,
                              backgroundColor: '#101828',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Funding Price */}
                    <div className="mt-6">
                      <p className="text-2xl font-light" style={{ color: '#101828' }}>
                        ₩{fundingProduct.fundingPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
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
                </div>
              </div>

              {/* Payment Method */}
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

              {/* Terms of Participation */}
              <div className="p-6" style={{ border: '0.5px solid #e5e7eb', backgroundColor: '#fafafa' }}>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 mt-1 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: '#101828' }}
                  />
                  <label htmlFor="terms" className="text-sm font-light text-gray-700 cursor-pointer leading-relaxed">
                    I understand that funding products are produced and shipped after the campaign ends.
                    Expected shipping date may vary based on production schedule.
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Funding Summary (Sticky) */}
            <div className="col-span-5">
              <div className="sticky top-24">
                <div className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
                  <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                    Funding Summary
                  </h2>

                  <div className="space-y-5 mb-8">
                    {/* Funding Amount */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-gray-600">Funding Amount</span>
                      <span className="text-sm font-light" style={{ color: '#101828' }}>
                        ₩{fundingAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* Shipping Fee */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-gray-600">Shipping Fee</span>
                      <span className="text-sm font-light" style={{ color: '#101828' }}>
                        Free
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
                          onClick={() => setPointsToUse(Math.min(availablePoints, fundingAmount))}
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

                  {/* Participation Button */}
                  <button
                    onClick={handleFunding}
                    disabled={!agreedToTerms}
                    className="w-full text-sm text-white font-medium tracking-widest transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#101828', height: '64px' }}
                  >
                    PARTICIPATE IN FUNDING
                  </button>

                  {/* Info Text */}
                  <p className="text-xs font-light text-gray-500 text-center mt-4 leading-relaxed">
                    You will be charged once the funding goal is reached
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
