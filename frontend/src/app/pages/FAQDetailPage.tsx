import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { ThumbsUp, ThumbsDown, CheckCircle2, Search as SearchIcon } from 'lucide-react';

interface RelatedQuestion {
  id: string;
  title: string;
  category: string;
}

export function FAQDetailPage() {
  const navigate = useNavigate();
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const faqTitle = 'How is the authenticity of the products verified?';
  const faqCategory = 'Authenticity';
  const lastUpdated = 'May 1, 2026';

  const relatedQuestions: RelatedQuestion[] = [
    {
      id: 'rel-1',
      title: 'What happens if a product fails authentication?',
      category: 'Authenticity',
    },
    {
      id: 'rel-2',
      title: 'How long does the authentication process take?',
      category: 'Authenticity',
    },
    {
      id: 'rel-3',
      title: 'Do you provide authentication certificates?',
      category: 'Authenticity',
    },
    {
      id: 'rel-4',
      title: 'Can I request a second opinion on authentication?',
      category: 'Authenticity',
    },
    {
      id: 'rel-5',
      title: 'What makes re:own authentication different?',
      category: 'Authenticity',
    },
  ];

  const handleFeedback = (type: 'yes' | 'no') => {
    setFeedbackGiven(type);
    console.log(`User feedback: ${type}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="grid grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="col-span-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm font-light text-gray-500 mb-8">
                <button
                  onClick={() => navigate('/support')}
                  className="hover:text-gray-900 transition-colors"
                >
                  Customer Service
                </button>
                <span>/</span>
                <button
                  onClick={() => navigate('/support/category/authenticity')}
                  className="hover:text-gray-900 transition-colors"
                >
                  {faqCategory}
                </button>
                <span>/</span>
                <span style={{ color: '#101828' }}>FAQ</span>
              </div>

              {/* Article Header */}
              <div className="mb-12">
                <div className="inline-block px-3 py-1 mb-4 text-xs font-light uppercase tracking-wider" style={{ backgroundColor: '#f3f4f6', color: '#101828' }}>
                  {faqCategory}
                </div>
                <h1 className="text-4xl font-light tracking-wide mb-4 leading-tight" style={{ color: '#101828' }}>
                  {faqTitle}
                </h1>
                <p className="text-sm font-light text-gray-500">
                  Last updated: {lastUpdated}
                </p>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-base font-light leading-relaxed space-y-6" style={{ color: '#101828' }}>
                  <p className="text-gray-600">
                    At re:own, product authenticity is our highest priority. Every item sold on our platform undergoes a comprehensive, multi-point inspection process conducted by our team of certified authentication experts.
                  </p>

                  <h2 className="text-2xl font-light mt-12 mb-6" style={{ color: '#101828' }}>
                    Our Authentication Process
                  </h2>

                  <div className="space-y-8">
                    {/* Step 1 */}
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-light text-white"
                          style={{ backgroundColor: '#101828' }}
                        >
                          1
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                          Physical Inspection
                        </h3>
                        <p className="text-sm font-light text-gray-600 leading-relaxed">
                          Our experts examine the item's materials, stitching, hardware, and overall construction quality. We verify that all elements match the brand's authentic specifications, including texture, weight, and finish.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-light text-white"
                          style={{ backgroundColor: '#101828' }}
                        >
                          2
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                          Serial Number & Code Verification
                        </h3>
                        <p className="text-sm font-light text-gray-600 leading-relaxed">
                          We verify all serial numbers, date codes, and other identifying markers against the brand's authentication database. Each code is cross-referenced to ensure it matches the item's production period and specifications.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-light text-white"
                          style={{ backgroundColor: '#101828' }}
                        >
                          3
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                          Craftsmanship Analysis
                        </h3>
                        <p className="text-sm font-light text-gray-600 leading-relaxed">
                          We assess the precision and quality of craftsmanship, including symmetry, alignment, and finishing. Luxury brands maintain exceptional standards, and we verify that the item meets these benchmarks.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-light text-white"
                          style={{ backgroundColor: '#101828' }}
                        >
                          4
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                          Documentation & Packaging Review
                        </h3>
                        <p className="text-sm font-light text-gray-600 leading-relaxed">
                          If the item includes original packaging, dust bags, certificates, or receipts, we verify their authenticity as well. These materials provide additional confirmation of the item's provenance.
                        </p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-light text-white"
                          style={{ backgroundColor: '#101828' }}
                        >
                          5
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg font-light mb-3" style={{ color: '#101828' }}>
                          Final Certification
                        </h3>
                        <p className="text-sm font-light text-gray-600 leading-relaxed">
                          Once the item passes all inspection points, it receives our authentication certificate. This certificate includes a detailed report of the verification process and serves as your guarantee of authenticity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Infographic Placeholder */}
                  <div className="my-12 p-16 text-center" style={{ backgroundColor: '#f9fafb', border: '0.5px solid #e5e7eb' }}>
                    <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm font-light text-gray-500">
                      Verification Process Infographic
                    </p>
                  </div>

                  <h2 className="text-2xl font-light mt-12 mb-6" style={{ color: '#101828' }}>
                    Our Expert Team
                  </h2>

                  <p className="text-gray-600">
                    Our authentication team consists of specialists with over 10 years of experience in luxury goods authentication. They undergo continuous training and maintain relationships with brand representatives to stay current on the latest authentication techniques and counterfeit detection methods.
                  </p>

                  <h2 className="text-2xl font-light mt-12 mb-6" style={{ color: '#101828' }}>
                    What Happens if an Item Fails Authentication?
                  </h2>

                  <p className="text-gray-600">
                    If an item does not pass our authentication process, it is immediately flagged and removed from sale. The seller is notified, and the item is returned at no cost to the buyer. We maintain a zero-tolerance policy for counterfeit items and work closely with authorities to combat fraud.
                  </p>

                  <div className="p-6 mt-8" style={{ backgroundColor: '#f0fdf4', border: '0.5px solid #86efac' }}>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                      <div>
                        <h4 className="text-base font-light mb-2" style={{ color: '#16a34a' }}>
                          100% Authenticity Guarantee
                        </h4>
                        <p className="text-sm font-light" style={{ color: '#15803d' }}>
                          Every item on re:own is guaranteed authentic. If you receive an item that is later proven to be counterfeit, we will provide a full refund including all fees.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="mt-16 pt-12" style={{ borderTop: '0.5px solid #e5e7eb' }}>
                {!feedbackGiven ? (
                  <div className="text-center">
                    <h3 className="text-xl font-light mb-6" style={{ color: '#101828' }}>
                      Was this article helpful?
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleFeedback('yes')}
                        className="px-8 py-3 text-sm font-light tracking-wide transition-all hover:bg-gray-900 flex items-center gap-2"
                        style={{ border: '0.5px solid #101828', color: '#101828' }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Yes
                      </button>
                      <button
                        onClick={() => handleFeedback('no')}
                        className="px-8 py-3 text-sm font-light tracking-wide transition-all hover:bg-gray-100 flex items-center gap-2"
                        style={{ border: '0.5px solid #d1d5db', color: '#101828' }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8" style={{ backgroundColor: '#f9fafb' }}>
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#101828' }} />
                    <h3 className="text-lg font-light mb-2" style={{ color: '#101828' }}>
                      Thank you for your feedback
                    </h3>
                    <p className="text-sm font-light text-gray-600">
                      {feedbackGiven === 'yes'
                        ? "We're glad this article was helpful!"
                        : "We're sorry this didn't help. Please contact our support team for further assistance."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-4">
              <div className="sticky top-24">
                {/* Related Questions */}
                <div className="p-6" style={{ backgroundColor: '#fafafa', border: '0.5px solid #e5e7eb' }}>
                  <h3 className="text-lg font-light mb-6" style={{ color: '#101828' }}>
                    Related Questions
                  </h3>
                  <div className="space-y-4">
                    {relatedQuestions.map((question) => (
                      <button
                        key={question.id}
                        onClick={() => navigate(`/support/faq/${question.id}`)}
                        className="w-full text-left group"
                      >
                        <div className="pb-4" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                          <p className="text-xs font-light text-gray-500 uppercase tracking-wider mb-2">
                            {question.category}
                          </p>
                          <p className="text-sm font-light group-hover:opacity-70 transition-opacity" style={{ color: '#101828' }}>
                            {question.title}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Still Need Help */}
                <div className="mt-6 p-6 text-center" style={{ border: '0.5px solid #e5e7eb' }}>
                  <h4 className="text-base font-light mb-3" style={{ color: '#101828' }}>
                    Still need help?
                  </h4>
                  <p className="text-sm font-light text-gray-600 mb-6">
                    Contact our customer service team for personalized assistance
                  </p>
                  <button
                    onClick={() => navigate('/support/inquiry')}
                    className="w-full py-3 text-sm text-white font-light tracking-wide transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#101828' }}
                  >
                    START 1:1 INQUIRY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="mt-16 pt-12" style={{ borderTop: '0.5px solid #e5e7eb' }}>
            <button
              onClick={() => navigate(-1)}
              className="text-sm font-light text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
