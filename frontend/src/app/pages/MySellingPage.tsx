import { useState } from 'react';
import { Header } from '../components/Header';
import { TrendingUp, Clock } from 'lucide-react';
import { allProducts } from '../data/products';

type SaleStatus = 'all' | 'pending' | 'sold' | 'settled';

interface SaleItem {
  saleId: string;
  product: typeof allProducts[0];
  saleDate: string;
  settlementDate?: string;
  finalPrice: number;
  status: 'pending' | 'sold' | 'settled';
}

export function MySellingPage() {
  const [activeTab, setActiveTab] = useState<SaleStatus>('all');

  // Sample sale data
  const sales: SaleItem[] = [
    {
      saleId: 'SALE-2024-001',
      product: allProducts[3],
      saleDate: '2024-04-28',
      settlementDate: '2024-05-05',
      finalPrice: 920000,
      status: 'settled',
    },
    {
      saleId: 'SALE-2024-002',
      product: allProducts[4],
      saleDate: '2024-05-02',
      finalPrice: 750000,
      status: 'sold',
    },
    {
      saleId: 'SALE-2024-003',
      product: allProducts[5],
      saleDate: '2024-05-04',
      finalPrice: 1100000,
      status: 'pending',
    },
  ];

  const filteredSales = sales.filter(sale =>
    activeTab === 'all' ? true : sale.status === activeTab
  );

  // Calculate summary
  const totalSoldAmount = sales
    .filter(s => s.status === 'settled')
    .reduce((sum, s) => sum + s.finalPrice, 0);

  const pendingSettlement = sales
    .filter(s => s.status === 'sold')
    .reduce((sum, s) => sum + s.finalPrice, 0);

  const tabs = [
    { value: 'all' as SaleStatus, label: 'All' },
    { value: 'pending' as SaleStatus, label: 'Pending Inspection' },
    { value: 'sold' as SaleStatus, label: 'Sold' },
    { value: 'settled' as SaleStatus, label: 'Settlement Completed' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: 'Inspection in Progress',
        bgColor: '#fef3c7',
        borderColor: '#fde047',
        textColor: '#ca8a04',
      },
      sold: {
        label: 'Sold - Pending Settlement',
        bgColor: '#dbeafe',
        borderColor: '#93c5fd',
        textColor: '#1e40af',
      },
      settled: {
        label: 'Settlement Done',
        bgColor: '#f0fdf4',
        borderColor: '#86efac',
        textColor: '#16a34a',
      },
    };
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-12">
          {/* Page Title */}
          <h1 className="text-4xl font-light tracking-wider mb-12" style={{ color: '#101828' }}>
            Selling History
          </h1>

          {/* Summary Dashboard */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Total Sold Amount */}
            <div className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm font-light text-gray-500 mb-2 uppercase tracking-wider">
                    Total Sold Amount
                  </p>
                  <p className="text-3xl font-light" style={{ color: '#101828' }}>
                    ₩{totalSoldAmount.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#16a34a' }} />
                </div>
              </div>
              <p className="text-xs font-light text-gray-500">
                Total earnings from completed settlements
              </p>
            </div>

            {/* Pending Settlement */}
            <div className="p-8" style={{ border: '0.5px solid #e5e7eb' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm font-light text-gray-500 mb-2 uppercase tracking-wider">
                    Pending Settlement
                  </p>
                  <p className="text-3xl font-light" style={{ color: '#101828' }}>
                    ₩{pendingSettlement.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <Clock className="w-6 h-6" style={{ color: '#1e40af' }} />
                </div>
              </div>
              <p className="text-xs font-light text-gray-500">
                Awaiting settlement processing
              </p>
            </div>
          </div>

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

          {/* Sale Items - Table-like Structure */}
          {filteredSales.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-light mb-2" style={{ color: '#101828' }}>
                No sales found
              </h3>
              <p className="text-gray-500 font-light">
                You haven't sold any items yet
              </p>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-6 px-8 py-4 mb-4" style={{ borderBottom: '0.5px solid #e5e7eb' }}>
                <div className="col-span-5">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wider">
                    Product
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wider">
                    Status
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wider">
                    Final Price
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wider">
                    Settlement Date
                  </p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-4">
                {filteredSales.map((sale) => {
                  const statusBadge = getStatusBadge(sale.status);
                  return (
                    <div
                      key={sale.saleId}
                      className="grid grid-cols-12 gap-6 items-center px-8 py-6 hover:bg-gray-50 transition-colors"
                      style={{ border: '0.5px solid #e5e7eb' }}
                    >
                      {/* Product */}
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="flex-shrink-0 w-20 h-24 bg-gray-50 overflow-hidden">
                          <img
                            src={sale.product.ogImageUrl}
                            alt={sale.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-light mb-1 truncate">
                            {sale.product.brandName}
                          </p>
                          <h3 className="text-sm font-light mb-1 truncate" style={{ color: '#101828' }}>
                            {sale.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-light">
                            Sale ID: {sale.saleId}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="col-span-3">
                        <div
                          className="inline-flex items-center gap-2 px-3 py-2"
                          style={{
                            backgroundColor: statusBadge.bgColor,
                            border: `0.5px solid ${statusBadge.borderColor}`,
                          }}
                        >
                          <span
                            className="text-sm font-light"
                            style={{ color: statusBadge.textColor }}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Final Price */}
                      <div className="col-span-2 text-right">
                        <p className="text-base font-light" style={{ color: '#101828' }}>
                          ₩{sale.finalPrice.toLocaleString()}
                        </p>
                      </div>

                      {/* Settlement Date */}
                      <div className="col-span-2 text-right">
                        <p className="text-sm font-light" style={{ color: '#101828' }}>
                          {sale.settlementDate || '—'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
