import { useState } from 'react';
import { Header } from '../components/Header';
import { CheckCircle2, Package } from 'lucide-react';
import { allProducts } from '../data/products';

type OrderStatus = 'all' | 'payment' | 'inspection' | 'shipping' | 'delivered';

interface OrderItem {
  orderId: string;
  product: typeof allProducts[0];
  purchaseDate: string;
  price: number;
  status: 'payment' | 'inspection' | 'shipping' | 'delivered';
  inspectionStatus?: 'verified' | 'pending';
  trackingNumber?: string;
}

export function MyBuyingPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  // Sample order data
  const orders: OrderItem[] = [
    {
      orderId: 'ORD-2024-001',
      product: allProducts[0],
      purchaseDate: '2024-05-01',
      price: 850000,
      status: 'delivered',
      inspectionStatus: 'verified',
      trackingNumber: 'TRK123456789',
    },
    {
      orderId: 'ORD-2024-002',
      product: allProducts[1],
      purchaseDate: '2024-05-03',
      price: 1200000,
      status: 'shipping',
      inspectionStatus: 'verified',
      trackingNumber: 'TRK987654321',
    },
    {
      orderId: 'ORD-2024-003',
      product: allProducts[2],
      purchaseDate: '2024-05-04',
      price: 650000,
      status: 'inspection',
      inspectionStatus: 'pending',
    },
  ];

  const filteredOrders = orders.filter(order =>
    activeTab === 'all' ? true : order.status === activeTab
  );

  const tabs = [
    { value: 'all' as OrderStatus, label: 'All' },
    { value: 'payment' as OrderStatus, label: 'Payment' },
    { value: 'inspection' as OrderStatus, label: 'Inspection' },
    { value: 'shipping' as OrderStatus, label: 'Shipping' },
    { value: 'delivered' as OrderStatus, label: 'Delivered' },
  ];

  const getStatusLabel = (status: string) => {
    const statusMap = {
      payment: 'Payment Completed',
      inspection: 'Under Inspection',
      shipping: 'In Transit',
      delivered: 'Delivered',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-12">
          {/* Page Title */}
          <h1 className="text-4xl font-light tracking-wider mb-12" style={{ color: '#101828' }}>
            Buying History
          </h1>

          {/* Status Tabs */}
          <div className="mb-12">
            <div className="flex gap-2" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className="px-6 pb-4 text-sm font-light tracking-wide transition-colors relative"
                  style={{
                    color: activeTab === tab.value ? '#101828' : '#9ca3af',
                  }}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{ height: '2px', backgroundColor: '#101828' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order Cards */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-light mb-2" style={{ color: '#101828' }}>
                No orders found
              </h3>
              <p className="text-gray-500 font-light">
                You haven't made any purchases yet
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-8"
                  style={{ border: '0.5px solid #e5e7eb' }}
                >
                  <div className="flex gap-8">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-32 h-40 bg-gray-50 overflow-hidden">
                      <img
                        src={order.product.ogImageUrl}
                        alt={order.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Brand & Product Name */}
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1 truncate">
                          {order.product.brandName}
                        </p>
                        <h3 className="text-lg font-light mb-3 truncate" style={{ color: '#101828' }}>
                          {order.product.name}
                        </h3>

                        {/* Order Info */}
                        <div className="flex items-center gap-6 text-sm font-light text-gray-600 mb-4">
                          <div>
                            <span className="text-xs text-gray-500">Order ID:</span>{' '}
                            <span style={{ color: '#101828' }}>{order.orderId}</span>
                          </div>
                          <div style={{ width: '0.5px', height: '14px', backgroundColor: '#d1d5db' }} />
                          <div>
                            <span className="text-xs text-gray-500">Date:</span>{' '}
                            <span style={{ color: '#101828' }}>{order.purchaseDate}</span>
                          </div>
                        </div>

                        {/* Inspection Status */}
                        {order.inspectionStatus && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4" style={{ backgroundColor: order.inspectionStatus === 'verified' ? '#f0fdf4' : '#fef3c7', border: `0.5px solid ${order.inspectionStatus === 'verified' ? '#86efac' : '#fde047'}` }}>
                            {order.inspectionStatus === 'verified' && (
                              <CheckCircle2 className="w-4 h-4" style={{ color: '#16a34a' }} />
                            )}
                            <span className="text-sm font-light" style={{ color: order.inspectionStatus === 'verified' ? '#16a34a' : '#ca8a04' }}>
                              {order.inspectionStatus === 'verified' ? 'Authenticity Verified' : 'Inspection Pending'}
                            </span>
                          </div>
                        )}

                        {/* Status */}
                        <div className="text-sm font-light">
                          <span className="text-gray-500">Status:</span>{' '}
                          <span style={{ color: '#101828' }}>{getStatusLabel(order.status)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Price & Actions */}
                    <div className="flex-shrink-0 flex flex-col items-end justify-between">
                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-light" style={{ color: '#101828' }}>
                          ₩{order.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Live Tracking Button */}
                      {order.trackingNumber && (
                        <button
                          className="px-6 py-3 text-sm font-light tracking-wide transition-all hover:opacity-80"
                          style={{ border: '0.5px solid #101828', color: '#101828' }}
                        >
                          Live Tracking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
