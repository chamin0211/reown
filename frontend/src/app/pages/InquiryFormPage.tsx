import { useState } from 'react';
import { Header } from '../components/Header';
import { ChevronDown, Upload, X, ShoppingBag } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
}

export function InquiryFormPage() {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const categories = [
    'Payment',
    'Shipping',
    'Return & Refund',
    'Authenticity',
    'The Vault',
    'Account & Membership',
    'Product Inquiry',
    'Other',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles].slice(0, 5));
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = () => {
    console.log('Submitting inquiry:', { category, subject, description, uploadedFiles, selectedOrder });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[900px] mx-auto px-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-light tracking-wider mb-4" style={{ color: '#101828' }}>
              Submit 1:1 Inquiry
            </h1>
            <p className="text-sm font-light text-gray-500">
              Our customer service team will respond within 24 hours
            </p>
          </div>

          {/* Inquiry Form */}
          <div className="space-y-8">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-light mb-3" style={{ color: '#101828' }}>
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-5 text-base font-light text-left flex items-center justify-between transition-all focus:border-gray-400"
                  style={{ border: '0.5px solid #d1d5db', height: '56px', color: category ? '#101828' : '#9ca3af' }}
                >
                  <span>{category || 'Select a category'}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                    <div
                      className="absolute top-full mt-2 w-full bg-white z-20 max-h-64 overflow-y-auto"
                      style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full px-5 py-3 text-sm font-light text-left hover:bg-gray-50 transition-colors"
                          style={{ color: '#101828' }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Select Order (Optional) */}
            <div>
              <label className="block text-sm font-light mb-3" style={{ color: '#101828' }}>
                Related Order (Optional)
              </label>
              <button
                onClick={() => setSelectedOrder('ORD-2024-001')}
                className="px-6 py-4 text-sm font-light tracking-wide transition-opacity hover:opacity-80 flex items-center gap-3"
                style={{ border: '0.5px solid #101828', color: '#101828' }}
              >
                <ShoppingBag className="w-4 h-4" />
                {selectedOrder ? `Order ${selectedOrder} Selected` : 'Select Order from History'}
              </button>
              <p className="text-xs font-light text-gray-500 mt-2">
                Link this inquiry to a specific purchase for faster resolution
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-light mb-3" style={{ color: '#101828' }}>
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry"
                className="w-full px-5 text-base font-light outline-none transition-all focus:border-gray-400"
                style={{ border: '0.5px solid #d1d5db', height: '56px', color: '#101828' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-light mb-3" style={{ color: '#101828' }}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide detailed information about your inquiry"
                rows={10}
                className="w-full px-5 py-4 text-base font-light outline-none resize-none transition-all focus:border-gray-400"
                style={{ border: '0.5px solid #d1d5db', color: '#101828' }}
              />
              <p className="text-xs font-light text-gray-500 mt-2">
                Minimum 20 characters required
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-light mb-3" style={{ color: '#101828' }}>
                Attachments (Optional)
              </label>
              <div
                className="p-8 text-center"
                style={{ border: '0.5px dashed #d1d5db', backgroundColor: '#fafafa' }}
              >
                <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                <p className="text-sm font-light mb-2" style={{ color: '#101828' }}>
                  Drag and drop files or click to browse
                </p>
                <p className="text-xs font-light text-gray-500 mb-4">
                  Maximum 5 files • PNG, JPG, PDF • Max 10MB each
                </p>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 text-sm font-light tracking-wide cursor-pointer transition-opacity hover:opacity-80"
                  style={{ border: '0.5px solid #101828', color: '#101828' }}
                >
                  Browse Files
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4"
                      style={{ border: '0.5px solid #e5e7eb' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                          <Upload className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-light" style={{ color: '#101828' }}>
                            {file.name}
                          </p>
                          <p className="text-xs font-light text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs font-light text-gray-500 mt-2">
                    {uploadedFiles.length} of 5 files uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="p-6" style={{ backgroundColor: '#f9fafb', border: '0.5px solid #e5e7eb' }}>
              <h4 className="text-sm font-light mb-3" style={{ color: '#101828' }}>
                Privacy Notice
              </h4>
              <p className="text-xs font-light text-gray-600 leading-relaxed">
                Your inquiry will be handled confidentially by our customer service team. Personal information
                provided will only be used to address your question and will not be shared with third parties.
                Responses are typically provided within 24 hours during business days.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={!category || !subject || !description || description.length < 20}
                className="w-full py-5 text-base text-white font-light tracking-wide transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#101828' }}
              >
                SUBMIT INQUIRY
              </button>
              <p className="text-xs font-light text-gray-500 text-center mt-3">
                You will receive a confirmation email once your inquiry is submitted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
