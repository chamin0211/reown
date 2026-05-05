import { useState } from 'react';
import { Header } from '../components/Header';
import { CheckCircle2, CreditCard, MapPin } from 'lucide-react';

export function SettingsPage() {
  const [contactEmail, setContactEmail] = useState('gemini.shop@gmail.com');
  const [notifications, setNotifications] = useState({
    transactions: true,
    marketingSms: false,
    marketingEmail: true,
  });

  const handleSaveEmail = () => {
    console.log('Saving contact email:', contactEmail);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="flex gap-12">
            {/* Left Sidebar (LNB) */}
            <div className="w-64 flex-shrink-0">
              <h2 className="text-2xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                My Page
              </h2>
              <nav className="space-y-2">
                <a
                  href="/my/buying"
                  className="block px-4 py-3 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Buying History
                </a>
                <a
                  href="/my/selling"
                  className="block px-4 py-3 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Selling History
                </a>
                <a
                  href="/my/bidding"
                  className="block px-4 py-3 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Bidding Status
                </a>
                <a
                  href="/wishlist"
                  className="block px-4 py-3 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Wishlist
                </a>
                <div
                  className="block px-4 py-3 text-sm font-medium transition-colors"
                  style={{ color: '#101828', borderLeft: '2px solid #101828' }}
                >
                  Account Settings
                </div>
              </nav>
            </div>

            {/* Right Main Content */}
            <div className="flex-1">
              <h1 className="text-4xl font-light tracking-wider mb-12" style={{ color: '#101828' }}>
                Account Settings
              </h1>

              <div className="space-y-12">
                {/* Section 1: Profile & Login Info */}
                <div className="pb-12" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                    Profile & Login Info
                  </h2>

                  <div className="space-y-6">
                    {/* Login ID (Read-only) */}
                    <div>
                      <label className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Login ID
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="email"
                          value="gemini@gmail.com"
                          readOnly
                          className="flex-1 px-4 text-base text-gray-600 font-light outline-none bg-gray-50"
                          style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                        />
                        <span className="text-sm font-light text-gray-500">Cannot be changed</span>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Password
                      </label>
                      <button
                        className="px-6 py-3 text-sm font-light tracking-wide transition-opacity hover:opacity-80"
                        style={{ border: '0.5px solid #101828', color: '#101828' }}
                      >
                        Change Password
                      </button>
                    </div>

                    {/* Identity Verification Status */}
                    <div>
                      <label className="block text-sm font-light mb-3" style={{ color: '#101828' }}>
                        Identity Verification Status
                      </label>
                      <div className="inline-flex items-center gap-2 px-4 py-2" style={{ backgroundColor: '#f0fdf4', border: '0.5px solid #86efac' }}>
                        <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                        <span className="text-sm font-light" style={{ color: '#16a34a' }}>
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact Information */}
                <div className="pb-12" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Phone Number
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="tel"
                          value="010-****-1234"
                          readOnly
                          className="flex-1 px-4 text-base text-gray-600 font-light outline-none bg-gray-50"
                          style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                        />
                        <button
                          className="px-6 py-3 text-sm font-light tracking-wide transition-opacity hover:opacity-80 whitespace-nowrap"
                          style={{ border: '0.5px solid #101828', color: '#101828' }}
                        >
                          Change Number
                        </button>
                      </div>
                      <p className="text-xs font-light text-gray-500 mt-2">
                        Changing your number requires re-verification
                      </p>
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label className="block text-sm font-light mb-2" style={{ color: '#101828' }}>
                        Contact Email (For Receipts/Notices)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="flex-1 px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                          style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                          placeholder="Enter contact email"
                        />
                        <button
                          onClick={handleSaveEmail}
                          className="px-6 py-3 text-sm font-light tracking-wide transition-opacity hover:opacity-80 whitespace-nowrap"
                          style={{ border: '0.5px solid #101828', color: '#101828' }}
                        >
                          Save Email
                        </button>
                      </div>
                      <p className="text-xs font-light text-gray-500 mt-2">
                        Separate from your login ID. Used for order confirmations and notifications.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Financial & Shipping Settings */}
                <div className="pb-12" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                  <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                    Financial & Shipping Settings
                  </h2>

                  <div className="space-y-8">
                    {/* Payout Bank Account */}
                    <div>
                      <label className="block text-sm font-light mb-4" style={{ color: '#101828' }}>
                        Payout Bank Account (정산 계좌)
                      </label>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Bank Name"
                            className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                            style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Account Number"
                            className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                            style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Account Holder"
                            className="w-full px-4 text-base text-gray-900 font-light outline-none transition-all focus:border-gray-400"
                            style={{ border: '0.5px solid #d1d5db', height: '52px' }}
                          />
                        </div>
                      </div>
                      <button
                        className="px-6 py-3 text-sm font-light tracking-wide transition-opacity hover:opacity-80"
                        style={{ border: '0.5px solid #101828', color: '#101828' }}
                      >
                        Register/Change Account
                      </button>
                    </div>

                    {/* Saved Payment Methods */}
                    <div>
                      <label className="block text-sm font-light mb-4" style={{ color: '#101828' }}>
                        Saved Payment Methods
                      </label>
                      <div className="space-y-3 mb-4">
                        {/* Card 1 */}
                        <div className="flex items-center justify-between p-4" style={{ border: '0.5px solid #e5e7eb' }}>
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-light" style={{ color: '#101828' }}>
                                Visa **** 1234
                              </p>
                              <p className="text-xs font-light text-gray-500">Expires 12/26</p>
                            </div>
                          </div>
                          <button className="text-sm font-light text-gray-500 hover:text-gray-900 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                      <button
                        className="px-6 py-3 text-sm font-light tracking-wide transition-opacity hover:opacity-80"
                        style={{ border: '0.5px solid #101828', color: '#101828' }}
                      >
                        Add New Card
                      </button>
                    </div>

                    {/* Address Book */}
                    <div>
                      <label className="block text-sm font-light mb-4" style={{ color: '#101828' }}>
                        Address Book
                      </label>
                      <div className="p-4 mb-4" style={{ border: '0.5px solid #e5e7eb' }}>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium" style={{ color: '#101828' }}>
                                홍길동
                              </p>
                              <span className="px-2 py-0.5 text-xs font-light text-white" style={{ backgroundColor: '#101828' }}>
                                Default
                              </span>
                            </div>
                            <p className="text-sm font-light text-gray-600">
                              서울시 강남구 테헤란로 123
                            </p>
                            <p className="text-sm font-light text-gray-600">
                              (06234) 4층 re:own
                            </p>
                            <p className="text-xs font-light text-gray-500 mt-2">010-1234-5678</p>
                          </div>
                        </div>
                      </div>
                      <button
                        className="px-6 py-3 text-sm font-light tracking-wide transition-opacity hover:opacity-80"
                        style={{ border: '0.5px solid #101828', color: '#101828' }}
                      >
                        Manage Addresses
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 4: Notification Preferences */}
                <div className="pb-12">
                  <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    {/* Transaction Updates */}
                    <div className="flex items-center justify-between py-4" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                      <div>
                        <p className="text-sm font-light mb-1" style={{ color: '#101828' }}>
                          Transaction Updates
                        </p>
                        <p className="text-xs font-light text-gray-500">
                          Receive notifications about bidding, shipping, and order status
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, transactions: !notifications.transactions })}
                        className="relative w-12 h-6 rounded-full transition-colors"
                        style={{ backgroundColor: notifications.transactions ? '#101828' : '#d1d5db' }}
                      >
                        <div
                          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                          style={{ left: notifications.transactions ? '28px' : '4px' }}
                        />
                      </button>
                    </div>

                    {/* Marketing SMS */}
                    <div className="flex items-center justify-between py-4" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                      <div>
                        <p className="text-sm font-light mb-1" style={{ color: '#101828' }}>
                          Marketing & Promotions (SMS)
                        </p>
                        <p className="text-xs font-light text-gray-500">
                          Receive promotional offers and updates via SMS
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, marketingSms: !notifications.marketingSms })}
                        className="relative w-12 h-6 rounded-full transition-colors"
                        style={{ backgroundColor: notifications.marketingSms ? '#101828' : '#d1d5db' }}
                      >
                        <div
                          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                          style={{ left: notifications.marketingSms ? '28px' : '4px' }}
                        />
                      </button>
                    </div>

                    {/* Marketing Email */}
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-light mb-1" style={{ color: '#101828' }}>
                          Marketing & Promotions (Email)
                        </p>
                        <p className="text-xs font-light text-gray-500">
                          Receive promotional offers and updates via email
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, marketingEmail: !notifications.marketingEmail })}
                        className="relative w-12 h-6 rounded-full transition-colors"
                        style={{ backgroundColor: notifications.marketingEmail ? '#101828' : '#d1d5db' }}
                      >
                        <div
                          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                          style={{ left: notifications.marketingEmail ? '28px' : '4px' }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="flex justify-end pt-8">
                <button className="text-sm font-light text-gray-400 hover:text-gray-600 transition-colors underline">
                  Delete Account (회원 탈퇴)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
