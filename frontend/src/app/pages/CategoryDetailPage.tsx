import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Truck, ChevronDown, MessageSquare } from 'lucide-react';

interface CategoryFAQ {
  id: string;
  question: string;
  preview: string;
  fullAnswer: string;
}

export function CategoryDetailPage() {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Example: Shipping Category
  const categoryTitle = 'Shipping & Delivery';
  const categoryDescription = 'Everything you need to know about shipping timelines, tracking, and delivery options';

  const categoryFAQs: CategoryFAQ[] = [
    {
      id: 'ship-1',
      question: 'How long does shipping take after authentication?',
      preview: 'Standard shipping takes 3-5 business days after authentication is complete...',
      fullAnswer: 'Standard shipping takes 3-5 business days after authentication is complete. Express shipping (1-2 business days) is available for an additional ₩15,000. For international orders, delivery typically takes 7-10 business days. All shipments include full insurance and real-time tracking. You will receive a notification email once your item ships with a tracking number.',
    },
    {
      id: 'ship-2',
      question: 'Can I track my order in real-time?',
      preview: 'Yes, all orders come with real-time tracking...',
      fullAnswer: 'Yes, all orders come with real-time tracking through our partnership with premium courier services. Once your item ships, you can track it in the "Buying History" section of your account or through the tracking link sent to your email. Updates include: picked up, in transit, out for delivery, and delivered status with timestamps.',
    },
    {
      id: 'ship-3',
      question: 'What happens if I\'m not home for delivery?',
      preview: 'Our courier will attempt delivery up to 3 times...',
      fullAnswer: 'Our courier will attempt delivery up to 3 times. If all attempts fail, the package will be held at the nearest depot for 7 days. You can reschedule delivery online or arrange for pickup at the depot. For high-value items over ₩5,000,000, signature confirmation is required and we can coordinate a specific delivery time window.',
    },
    {
      id: 'ship-4',
      question: 'Do you ship internationally?',
      preview: 'Yes, we ship to over 50 countries worldwide...',
      fullAnswer: 'Yes, we ship to over 50 countries worldwide. International shipping costs vary by destination and are calculated at checkout. All international shipments include customs documentation and full insurance. Please note that customs duties and taxes are the responsibility of the buyer and are not included in the shipping cost. Delivery times range from 7-14 business days depending on the destination.',
    },
    {
      id: 'ship-5',
      question: 'How is my item packaged for shipping?',
      preview: 'All items are packaged with premium materials...',
      fullAnswer: 'All items are packaged with premium materials to ensure safe delivery. Luxury items are placed in protective dust bags, then secured in custom-sized boxes with cushioning material. Each package is discreetly branded with the re:own logo and includes tamper-evident seals for security. Fragile items receive additional reinforcement and "Handle with Care" labels.',
    },
    {
      id: 'ship-6',
      question: 'What if my item is damaged during shipping?',
      preview: 'All shipments are fully insured...',
      fullAnswer: 'All shipments are fully insured for their full value. If your item arrives damaged, do not discard the packaging. Take photos of the damage and the packaging, then contact our customer service within 48 hours of delivery. We will arrange for a return pickup and either send a replacement (if available) or issue a full refund including shipping costs. Our team will handle all insurance claims on your behalf.',
    },
    {
      id: 'ship-7',
      question: 'Can I change my shipping address after placing an order?',
      preview: 'Address changes are possible before the item ships...',
      fullAnswer: 'Address changes are possible before the item ships. Contact our customer service team immediately through 1:1 inquiry with your order number and new address. If the item has not yet been dispatched, we can update the address at no charge. Once shipped, address changes may incur additional fees depending on the courier and new location. For security reasons, we may require identity verification for address changes.',
    },
  ];

  const handleFAQToggle = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1000px] mx-auto px-12">
          {/* Category Header */}
          <div className="mb-16 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ border: '0.5px solid #e5e7eb' }}>
              <Truck className="w-10 h-10" style={{ color: '#101828' }} />
            </div>
            <h1 className="text-4xl font-light tracking-wider mb-4" style={{ color: '#101828' }}>
              {categoryTitle}
            </h1>
            <p className="text-base font-light text-gray-500 max-w-2xl mx-auto">
              {categoryDescription}
            </p>
          </div>

          {/* Top FAQs Section */}
          <div className="mb-16">
            <h2 className="text-xl font-light tracking-wide mb-8" style={{ color: '#101828' }}>
              Top Questions
            </h2>

            <div className="space-y-4">
              {categoryFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="overflow-hidden"
                  style={{ border: '0.5px solid #e5e7eb' }}
                >
                  <button
                    onClick={() => handleFAQToggle(faq.id)}
                    className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 pr-6">
                      <h3 className="text-base font-light mb-2" style={{ color: '#101828' }}>
                        {faq.question}
                      </h3>
                      {expandedFAQ !== faq.id && (
                        <p className="text-sm font-light text-gray-500">
                          {faq.preview}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 mt-1 ${
                        expandedFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-sm font-light text-gray-600 leading-relaxed">
                        {faq.fullAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-12 text-center" style={{ border: '0.5px solid #e5e7eb', backgroundColor: '#fafafa' }}>
            <MessageSquare className="w-12 h-12 mx-auto mb-6" style={{ color: '#101828' }} />
            <h3 className="text-2xl font-light mb-3" style={{ color: '#101828' }}>
              Can't find your answer?
            </h3>
            <p className="text-sm font-light text-gray-600 mb-8 max-w-md mx-auto">
              Our customer service team is here to help. Submit a 1:1 inquiry and we'll respond within 24 hours.
            </p>
            <button
              onClick={() => navigate('/support/inquiry')}
              className="px-12 py-4 text-sm text-white font-light tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#101828' }}
            >
              START 1:1 INQUIRY
            </button>
          </div>

          {/* Back to Support Center */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/support')}
              className="text-sm font-light text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to Customer Service Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
