import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Search, Truck, RotateCcw, Shield, Lock, CreditCard, ChevronDown, MessageSquare, Clock, Bell } from 'lucide-react';

type CSTab = 'notice' | 'faq' | 'inquiry' | 'guide';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface NoticeItem {
  id: string;
  title: string;
  date: string;
  isImportant?: boolean;
}

export function SupportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CSTab>('faq');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ Data
  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'How does the authenticity verification process work?',
      answer: 'Every item sold on re:own undergoes a rigorous multi-point inspection by our certified authentication experts. We examine materials, stitching, hardware, serial numbers, and overall craftsmanship. The process typically takes 2-3 business days, and you\'ll receive a detailed verification report with your purchase.',
      category: 'Authenticity',
    },
    {
      id: 'faq-2',
      question: 'What is the shipping timeline for my order?',
      answer: 'Standard shipping takes 3-5 business days after authentication is complete. Express shipping (1-2 business days) is available for an additional fee. For international orders, delivery typically takes 7-10 business days. All shipments include full insurance and tracking.',
      category: 'Shipping',
    },
    {
      id: 'faq-3',
      question: 'Can I return or exchange an item?',
      answer: 'Yes, we offer a 7-day return policy from the delivery date. Items must be unworn, with all original tags and packaging intact. Once we receive and inspect the return, refunds are processed within 5-7 business days to your original payment method. Exchanges are subject to availability.',
      category: 'Returns',
    },
    {
      id: 'faq-4',
      question: 'How does The Vault storage service work?',
      answer: 'The Vault is our premium storage solution where you can store your purchased items in our climate-controlled, insured facility. This allows you to buy and sell without physical shipping, and provides instant liquidity when you decide to resell. Storage is complimentary for VIP members, or ₩5,000/month per item for standard members.',
      category: 'The Vault',
    },
    {
      id: 'faq-5',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Korean payment methods including KakaoPay, Naver Pay, and bank transfers. For high-value purchases over ₩5,000,000, we also offer installment payment plans through our partner banks.',
      category: 'Payment',
    },
    {
      id: 'faq-6',
      question: 'How do I become a VIP member?',
      answer: 'VIP membership is earned through purchase activity. Spend ₩10,000,000 or more within a 12-month period to qualify for VIP status. Benefits include complimentary Vault storage, priority authentication, exclusive access to limited releases, and dedicated concierge support.',
      category: 'Membership',
    },
  ];

  // Notice Data
  const notices: NoticeItem[] = [
    {
      id: 'notice-1',
      title: 'System Maintenance Scheduled - May 6th, 2026',
      date: '2026-05-03',
      isImportant: true,
    },
    {
      id: 'notice-2',
      title: 'New Brand Launch: Maison Margiela Collection',
      date: '2026-05-01',
    },
    {
      id: 'notice-3',
      title: 'Updated Return Policy - Extended to 7 Days',
      date: '2026-04-28',
    },
  ];

  const quickCategories = [
    { icon: Truck, label: 'Shipping', color: '#101828', path: '/support/category/shipping' },
    { icon: RotateCcw, label: 'Returns/Refunds', color: '#101828', path: '/support/category/returns' },
    { icon: Shield, label: 'Authenticity', color: '#101828', path: '/support/category/authenticity' },
    { icon: Lock, label: 'The Vault', color: '#101828', path: '/support/category/vault' },
    { icon: CreditCard, label: 'Payment', color: '#101828', path: '/support/category/payment' },
  ];

  const handleFAQToggle = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="flex gap-12">
            {/* Left Sidebar (CS Navigation) */}
            <div className="w-64 flex-shrink-0">
              <h2 className="text-2xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
                Customer Service
              </h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('notice')}
                  className={`w-full text-left block px-4 py-3 text-sm font-light transition-colors ${
                    activeTab === 'notice' ? 'font-medium' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === 'notice' ? { color: '#101828', borderLeft: '2px solid #101828' } : {}}
                >
                  Notice
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`w-full text-left block px-4 py-3 text-sm font-light transition-colors ${
                    activeTab === 'faq' ? 'font-medium' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === 'faq' ? { color: '#101828', borderLeft: '2px solid #101828' } : {}}
                >
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab('inquiry')}
                  className={`w-full text-left block px-4 py-3 text-sm font-light transition-colors ${
                    activeTab === 'inquiry' ? 'font-medium' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === 'inquiry' ? { color: '#101828', borderLeft: '2px solid #101828' } : {}}
                >
                  1:1 Inquiry
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`w-full text-left block px-4 py-3 text-sm font-light transition-colors ${
                    activeTab === 'guide' ? 'font-medium' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === 'guide' ? { color: '#101828', borderLeft: '2px solid #101828' } : {}}
                >
                  Service Guide
                </button>
              </nav>
            </div>

            {/* Right Main Content */}
            <div className="flex-1">
              {/* Search Bar Section */}
              <div className="mb-12">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#101828' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="How can we help you today?"
                    className="w-full pl-16 pr-6 text-base font-light outline-none transition-all focus:border-gray-400"
                    style={{ border: '0.5px solid #d1d5db', height: '64px', color: '#101828' }}
                  />
                </div>

                {/* Quick Category Icons */}
                <div className="flex items-center justify-center gap-8 mt-10">
                  {quickCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.label}
                        onClick={() => navigate(category.path)}
                        className="flex flex-col items-center gap-3 group hover:opacity-70 transition-opacity"
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ border: '0.5px solid #e5e7eb' }}
                        >
                          <Icon className="w-7 h-7" style={{ color: category.color }} />
                        </div>
                        <span className="text-sm font-light" style={{ color: '#101828' }}>
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Based on Active Tab */}
              {activeTab === 'faq' && (
                <div>
                  <h1 className="text-4xl font-light tracking-wider mb-4" style={{ color: '#101828' }}>
                    Frequently Asked Questions
                  </h1>
                  <p className="text-sm font-light text-gray-500 mb-12">
                    Find answers to the most common questions about re:own
                  </p>

                  {/* FAQ Accordion */}
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="overflow-hidden"
                        style={{ border: '0.5px solid #e5e7eb' }}
                      >
                        <button
                          onClick={() => navigate(`/support/faq/${faq.id}`)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 pr-6">
                            <span className="text-xs font-light text-gray-500 uppercase tracking-wider mb-2 block">
                              {faq.category}
                            </span>
                            <h3 className="text-base font-light" style={{ color: '#101828' }}>
                              {faq.question}
                            </h3>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 -rotate-90" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notice' && (
                <div>
                  <h1 className="text-4xl font-light tracking-wider mb-4" style={{ color: '#101828' }}>
                    Notices & Announcements
                  </h1>
                  <p className="text-sm font-light text-gray-500 mb-12">
                    Stay updated with the latest news from re:own
                  </p>

                  <div className="space-y-4">
                    {notices.map((notice) => (
                      <div
                        key={notice.id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ border: '0.5px solid #e5e7eb' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {notice.isImportant && (
                                <span
                                  className="px-2 py-1 text-xs font-medium text-white"
                                  style={{ backgroundColor: '#101828' }}
                                >
                                  IMPORTANT
                                </span>
                              )}
                              <h3 className="text-base font-light" style={{ color: '#101828' }}>
                                {notice.title}
                              </h3>
                            </div>
                          </div>
                          <span className="text-sm font-light text-gray-500">{notice.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'inquiry' && (
                <div>
                  <h1 className="text-4xl font-light tracking-wider mb-4" style={{ color: '#101828' }}>
                    1:1 Inquiry
                  </h1>
                  <p className="text-sm font-light text-gray-500 mb-12">
                    Get personalized support from our customer service team
                  </p>

                  <div className="grid grid-cols-2 gap-8">
                    {/* 1:1 Inquiry Card */}
                    <div className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
                      <MessageSquare className="w-8 h-8 mb-6" style={{ color: '#101828' }} />
                      <h3 className="text-xl font-light mb-3" style={{ color: '#101828' }}>
                        Submit an Inquiry
                      </h3>
                      <p className="text-sm font-light text-gray-600 mb-8 leading-relaxed">
                        Have a specific question? Our dedicated support team will respond within 24 hours.
                      </p>
                      <button
                        onClick={() => navigate('/support/inquiry')}
                        className="w-full py-4 text-sm text-white font-light tracking-wide transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#101828' }}
                      >
                        START 1:1 INQUIRY
                      </button>
                    </div>

                    {/* Operation Hours Card */}
                    <div className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
                      <Clock className="w-8 h-8 mb-6" style={{ color: '#101828' }} />
                      <h3 className="text-xl font-light mb-3" style={{ color: '#101828' }}>
                        Operation Hours
                      </h3>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between text-sm font-light">
                          <span className="text-gray-600">Customer Service</span>
                          <span style={{ color: '#101828' }}>Mon-Fri 10:00 - 18:00 (KST)</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-light">
                          <span className="text-gray-600">Authentication Team</span>
                          <span style={{ color: '#101828' }}>Mon-Sat 09:00 - 20:00 (KST)</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-light">
                          <span className="text-gray-600">VIP Concierge</span>
                          <span style={{ color: '#101828' }}>24/7 Available</span>
                        </div>
                      </div>
                      <p className="text-xs font-light text-gray-500">
                        Closed on public holidays. Emergency support available for VIP members.
                      </p>
                    </div>
                  </div>

                  {/* Notice Preview */}
                  <div className="mt-12 p-8" style={{ backgroundColor: '#f9fafb', border: '0.5px solid #e5e7eb' }}>
                    <div className="flex items-center gap-2 mb-6">
                      <Bell className="w-5 h-5" style={{ color: '#101828' }} />
                      <h3 className="text-lg font-light" style={{ color: '#101828' }}>
                        Latest Announcements
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {notices.slice(0, 3).map((notice) => (
                        <div
                          key={notice.id}
                          className="flex items-center justify-between py-3"
                          style={{ borderBottom: '0.5px solid #e5e7eb' }}
                        >
                          <div className="flex items-center gap-3">
                            {notice.isImportant && (
                              <span
                                className="px-2 py-0.5 text-xs font-medium text-white"
                                style={{ backgroundColor: '#101828' }}
                              >
                                NEW
                              </span>
                            )}
                            <span className="text-sm font-light" style={{ color: '#101828' }}>
                              {notice.title}
                            </span>
                          </div>
                          <span className="text-xs font-light text-gray-500">{notice.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'guide' && (
                <div>
                  <h1 className="text-4xl font-light tracking-wider mb-4" style={{ color: '#101828' }}>
                    Service Guide
                  </h1>
                  <p className="text-sm font-light text-gray-500 mb-12">
                    Learn how to use re:own services effectively
                  </p>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 hover:bg-gray-50 transition-colors cursor-pointer" style={{ border: '0.5px solid #e5e7eb' }}>
                      <Shield className="w-8 h-8 mb-4" style={{ color: '#101828' }} />
                      <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                        Authentication Process
                      </h3>
                      <p className="text-sm font-light text-gray-600">
                        Learn about our rigorous multi-point inspection and verification procedures.
                      </p>
                    </div>

                    <div className="p-8 hover:bg-gray-50 transition-colors cursor-pointer" style={{ border: '0.5px solid #e5e7eb' }}>
                      <Truck className="w-8 h-8 mb-4" style={{ color: '#101828' }} />
                      <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                        Shipping & Delivery
                      </h3>
                      <p className="text-sm font-light text-gray-600">
                        Understand shipping timelines, insurance, and tracking for your purchases.
                      </p>
                    </div>

                    <div className="p-8 hover:bg-gray-50 transition-colors cursor-pointer" style={{ border: '0.5px solid #e5e7eb' }}>
                      <Lock className="w-8 h-8 mb-4" style={{ color: '#101828' }} />
                      <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                        The Vault Storage
                      </h3>
                      <p className="text-sm font-light text-gray-600">
                        Discover how to store, manage, and trade items in our secure facility.
                      </p>
                    </div>

                    <div className="p-8 hover:bg-gray-50 transition-colors cursor-pointer" style={{ border: '0.5px solid #e5e7eb' }}>
                      <RotateCcw className="w-8 h-8 mb-4" style={{ color: '#101828' }} />
                      <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                        Returns & Exchanges
                      </h3>
                      <p className="text-sm font-light text-gray-600">
                        Review our return policy and learn how to initiate a return or exchange.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
