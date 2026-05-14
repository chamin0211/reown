import { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Package, ChevronDown } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';
import { format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SuperAdminSidebar } from './SuperAdminSidebar';

// Mock data for revenue by source (Funding vs Regular Store)
const revenueBySourceData = [
  { month: '2025-10', funding: 145000000, regular: 320000000 },
  { month: '2025-11', funding: 178000000, regular: 385000000 },
  { month: '2025-12', funding: 210000000, regular: 445000000 },
  { month: '2026-01', funding: 265000000, regular: 510000000 },
  { month: '2026-02', funding: 298000000, regular: 580000000 },
  { month: '2026-03', funding: 325000000, regular: 625000000 },
];

// Mock data for market share by category
const marketShareData = [
  { name: '국내 디자이너', value: 45, color: '#1e40af' },
  { name: '해외 럭셔리', value: 35, color: '#3b82f6' },
  { name: '빈티지 아카이브', value: 12, color: '#60a5fa' },
  { name: '스트릿웨어', value: 8, color: '#93c5fd' },
];

// Mock data for Top 10 Brands
const topBrandsData = [
  { 
    rank: 1, 
    brand: 'Noir Archive', 
    category: '해외 럭셔리',
    gmv: 285000000, 
    commission: 42750000,
    commissionRate: 15,
    growth: 28.5,
    orders: 1247
  },
  { 
    rank: 2, 
    brand: 'ADER Error', 
    category: '국내 디자이너',
    gmv: 198000000, 
    commission: 19800000,
    commissionRate: 10,
    growth: 15.3,
    orders: 2156
  },
  { 
    rank: 3, 
    brand: 'Andersson Bell', 
    category: '국내 디자이너',
    gmv: 176000000, 
    commission: 17600000,
    commissionRate: 10,
    growth: 22.1,
    orders: 1893
  },
  { 
    rank: 4, 
    brand: 'Maison Margiela', 
    category: '해외 럭셔리',
    gmv: 165000000, 
    commission: 24750000,
    commissionRate: 15,
    growth: -5.2,
    orders: 843
  },
  { 
    rank: 5, 
    brand: 'Maison Kitsuné', 
    category: '국내 디자이너',
    gmv: 142000000, 
    commission: 14200000,
    commissionRate: 10,
    growth: 31.4,
    orders: 1576
  },
  { 
    rank: 6, 
    brand: 'Lemaire', 
    category: '해외 럭셔리',
    gmv: 138000000, 
    commission: 20700000,
    commissionRate: 15,
    growth: 18.7,
    orders: 724
  },
  { 
    rank: 7, 
    brand: 'Acne Studios', 
    category: '해외 럭셔리',
    gmv: 125000000, 
    commission: 18750000,
    commissionRate: 15,
    growth: 9.8,
    orders: 687
  },
  { 
    rank: 8, 
    brand: 'Supreme', 
    category: '스트릿웨어',
    gmv: 118000000, 
    commission: 17700000,
    commissionRate: 15,
    growth: 45.2,
    orders: 2341
  },
  { 
    rank: 9, 
    brand: 'Our Legacy', 
    category: '빈티지 아카이브',
    gmv: 105000000, 
    commission: 15750000,
    commissionRate: 15,
    growth: 12.3,
    orders: 542
  },
  { 
    rank: 10, 
    brand: 'The Row', 
    category: '해외 럭셔리',
    gmv: 98000000, 
    commission: 14700000,
    commissionRate: 15,
    growth: 6.5,
    orders: 423
  },
];

// Mock detailed transaction data
const detailedTransactionData = [
  { 
    date: '2026-04-02', 
    totalOrders: 847, 
    gmv: 245000000, 
    discount: 12250000, 
    netRevenue: 232750000,
    commissionEarned: 23275000,
    payoutStatus: '정산 완료'
  },
  { 
    date: '2026-04-01', 
    totalOrders: 923, 
    gmv: 278000000, 
    discount: 13900000, 
    netRevenue: 264100000,
    commissionEarned: 26410000,
    payoutStatus: '정산 완료'
  },
  { 
    date: '2026-03-31', 
    totalOrders: 765, 
    gmv: 198000000, 
    discount: 9900000, 
    netRevenue: 188100000,
    commissionEarned: 18810000,
    payoutStatus: '정산 완료'
  },
  { 
    date: '2026-03-30', 
    totalOrders: 891, 
    gmv: 267000000, 
    discount: 13350000, 
    netRevenue: 253650000,
    commissionEarned: 25365000,
    payoutStatus: '정산 대기'
  },
  { 
    date: '2026-03-29', 
    totalOrders: 1045, 
    gmv: 312000000, 
    discount: 15600000, 
    netRevenue: 296400000,
    commissionEarned: 29640000,
    payoutStatus: '정산 대기'
  },
  { 
    date: '2026-03-28', 
    totalOrders: 756, 
    gmv: 223000000, 
    discount: 11150000, 
    netRevenue: 211850000,
    commissionEarned: 21185000,
    payoutStatus: '정산 완료'
  },
  { 
    date: '2026-03-27', 
    totalOrders: 834, 
    gmv: 256000000, 
    discount: 12800000, 
    netRevenue: 243200000,
    commissionEarned: 24320000,
    payoutStatus: '정산 완료'
  },
];

type DateRange = 'last7' | 'last30' | 'last90' | 'custom';

export function RevenueAnalyticsPage() {
  const [dateRange, setDateRange] = useState<'last7' | 'last30' | 'last90' | 'custom'>('last30');
  const [customDateStart, setCustomDateStart] = useState<Date | undefined>(subDays(new Date(), 30));
  const [customDateEnd, setCustomDateEnd] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState<string>('all');
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  // Format date input as user types (YYYY.MM.DD)
  const formatDateInput = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/[^\d]/g, '');
    
    // Limit to 8 digits (YYYYMMDD)
    const limited = numbers.slice(0, 8);
    
    // Add dots after year and month
    let formatted = limited;
    if (limited.length > 4) {
      formatted = limited.slice(0, 4) + '.' + limited.slice(4);
    }
    if (limited.length > 6) {
      formatted = limited.slice(0, 4) + '.' + limited.slice(4, 6) + '.' + limited.slice(6);
    }
    
    return formatted;
  };

  const handleStartDateChange = (value: string) => {
    const formatted = formatDateInput(value);
    setStartDateInput(formatted);
  };

  const handleEndDateChange = (value: string) => {
    const formatted = formatDateInput(value);
    setEndDateInput(formatted);
  };

  const applyCustomDateRange = () => {
    // Parse start date
    if (startDateInput.length === 10) {
      const [year, month, day] = startDateInput.split('.').map(Number);
      const startDate = new Date(year, month - 1, day);
      if (!isNaN(startDate.getTime())) {
        setCustomDateStart(startDate);
      }
    }

    // Parse end date
    if (endDateInput.length === 10) {
      const [year, month, day] = endDateInput.split('.').map(Number);
      const endDate = new Date(year, month - 1, day);
      if (!isNaN(endDate.getTime())) {
        setCustomDateEnd(endDate);
      }
    }

    // Apply custom date range
    if (startDateInput.length === 10 && endDateInput.length === 10) {
      setDateRange('custom');
      setIsDatePopoverOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `₩${(value / 100000000).toFixed(1)}억`;
    } else if (value >= 10000) {
      return `₩${(value / 10000).toFixed(0)}만`;
    }
    return `₩${value.toLocaleString()}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleExportToExcel = () => {
    // Mock export functionality
    const csvContent = [
      ['날짜', '총 주문수', 'GMV', '할인 적용액', '순 매출', '수수료 수익', '정산 상태'].join(','),
      ...detailedTransactionData.map(row => 
        [row.date, row.totalOrders, row.gmv, row.discount, row.netRevenue, row.commissionEarned, row.payoutStatus].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `revenue_analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getDateRangeText = () => {
    switch (dateRange) {
      case 'last7':
        return '최근 7일';
      case 'last30':
        return '최근 30일';
      case 'last90':
        return '최근 90일';
      case 'custom':
        if (customDateStart && customDateEnd) {
          return `${format(customDateStart, 'yyyy.MM.dd')} - ${format(customDateEnd, 'yyyy.MM.dd')}`;
        }
        return '커스텀 기간';
      default:
        return '최근 30일';
    }
  };

  // Calculate totals
  const totalGMV = detailedTransactionData.reduce((sum, item) => sum + item.gmv, 0);
  const totalCommission = detailedTransactionData.reduce((sum, item) => sum + item.commissionEarned, 0);
  const totalOrders = detailedTransactionData.reduce((sum, item) => sum + item.totalOrders, 0);
  const avgOrderValue = totalGMV / totalOrders;

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">매출 & 수익 분석</h1>
          <p className="text-gray-600">플랫폼 전체 매출 데이터와 브랜드별 성과를 심층 분석합니다</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" size={20} />
              <span className="text-sm font-semibold text-gray-700">기간:</span>
              <div className="flex gap-2">
                <Button
                  variant={dateRange === 'last7' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('last7')}
                  className={dateRange === 'last7' ? 'bg-[#1e40af]' : ''}
                >
                  최근 7일
                </Button>
                <Button
                  variant={dateRange === 'last30' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('last30')}
                  className={dateRange === 'last30' ? 'bg-[#1e40af]' : ''}
                >
                  최근 30일
                </Button>
                <Button
                  variant={dateRange === 'last90' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('last90')}
                  className={dateRange === 'last90' ? 'bg-[#1e40af]' : ''}
                >
                  최근 90일
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={dateRange === 'custom' ? 'default' : 'outline'}
                      size="sm"
                      className={dateRange === 'custom' ? 'bg-[#1e40af]' : ''}
                    >
                      기간 설정 <ChevronDown size={16} className="ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          시작일
                        </label>
                        <input
                          type="text"
                          value={startDateInput}
                          onChange={(e) => handleStartDateChange(e.target.value)}
                          placeholder="YYYY.MM.DD"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          종료일
                        </label>
                        <input
                          type="text"
                          value={endDateInput}
                          onChange={(e) => handleEndDateChange(e.target.value)}
                          placeholder="YYYY.MM.DD"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                        />
                      </div>
                      {customDateStart && customDateEnd && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">선택된 기간:</p>
                          <p className="text-sm font-semibold text-[#1e40af]">
                            {format(customDateStart, 'yyyy.MM.dd')} - {format(customDateEnd, 'yyyy.MM.dd')}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={applyCustomDateRange}
                          className="bg-[#1e40af] hover:bg-[#1e3a8a]"
                        >
                          적용
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300"></div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Package className="text-gray-500" size={20} />
              <span className="text-sm font-semibold text-gray-700">카테고리:</span>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  <SelectItem value="domestic">국내 디자이너</SelectItem>
                  <SelectItem value="luxury">해외 럭셔리</SelectItem>
                  <SelectItem value="vintage">빈티지 아카이브</SelectItem>
                  <SelectItem value="streetwear">스트릿웨어</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filter Display */}
            <div className="ml-auto">
              <span className="text-sm text-gray-600">선택된 기간: </span>
              <span className="text-sm font-bold text-[#1e40af]">{getDateRangeText()}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">총 거래액 (GMV)</p>
              <DollarSign className="text-[#1e40af]" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(totalGMV)}</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-green-600 font-semibold">+18.4%</span>
              <span className="text-gray-500">vs 이전 기간</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">총 수수료 수익</p>
              <TrendingUp className="text-[#1e40af]" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(totalCommission)}</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-green-600 font-semibold">+22.7%</span>
              <span className="text-gray-500">vs 이전 기간</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">총 주문 건수</p>
              <Package className="text-[#1e40af]" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{totalOrders.toLocaleString()}건</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-green-600 font-semibold">+15.2%</span>
              <span className="text-gray-500">vs 이전 기간</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">평균 주문 금액</p>
              <DollarSign className="text-[#1e40af]" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(avgOrderValue)}</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-green-600 font-semibold">+2.8%</span>
              <span className="text-gray-500">vs 이전 기간</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Stacked Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">매출 구성 분석</h2>
              <p className="text-sm text-gray-600">펀딩 vs 일반 스토어 판매 비교</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueBySourceData}>
                <CartesianGrid key="cartesian-grid" strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  key="x-axis"
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return `${year.slice(2)}/${month}`;
                  }}
                />
                <YAxis 
                  key="y-axis"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  key="tooltip"
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend 
                  key="legend"
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  key="funding-bar"
                  dataKey="funding" 
                  stackId="a" 
                  fill="#1e40af" 
                  name="펀딩 매출"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  key="regular-bar"
                  dataKey="regular" 
                  stackId="a" 
                  fill="#60a5fa" 
                  name="일반 스토어 매출"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">카테고리별 시장 점유율</h2>
              <p className="text-sm text-gray-600">브랜드 카테고리 분포</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {marketShareData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 10 Brands Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Top 10 브랜드 성과</h2>
            <p className="text-sm text-gray-600">GMV 기준 상위 브랜드 및 수수료 수익</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">순위</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">브랜드명</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">카테고리</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">GMV</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">수수료율</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">수수료 수익</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">주문 건수</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">성장률</th>
                </tr>
              </thead>
              <tbody>
                {topBrandsData.map((brand, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index < 3 ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-300 text-orange-900' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {brand.rank}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{brand.brand}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{brand.category}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900">{formatCurrency(brand.gmv)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-[#1e40af]">{brand.commissionRate}%</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-[#1e40af]">{formatCurrency(brand.commission)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-gray-700">{brand.orders.toLocaleString()}건</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
                        brand.growth > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {brand.growth > 0 ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {formatPercent(Math.abs(brand.growth))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Data Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">상세 거래 데이터</h2>
              <p className="text-sm text-gray-600">일별 매출 및 정산 상태</p>
            </div>
            <Button 
              onClick={handleExportToExcel}
              className="bg-[#1e40af] hover:bg-[#1e3a8a]"
            >
              <Download size={16} className="mr-2" />
              Excel 다운로드
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">날짜</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">총 주문수</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">GMV</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">할인 적용액</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">순 매출</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">수수료 수익</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">정산 상태</th>
                </tr>
              </thead>
              <tbody>
                {detailedTransactionData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">
                        {format(new Date(row.date), 'yyyy년 MM월 dd일', { locale: ko })}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-gray-900">{row.totalOrders.toLocaleString()}건</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900">{formatCurrency(row.gmv)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-red-600 font-medium">-{formatCurrency(row.discount)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-gray-900">{formatCurrency(row.netRevenue)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-[#1e40af]">{formatCurrency(row.commissionEarned)}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        row.payoutStatus === '정산 완료' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {row.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="py-4 px-4 font-bold text-gray-900">합계</td>
                  <td className="py-4 px-4 text-right font-bold text-gray-900">
                    {totalOrders.toLocaleString()}건
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(totalGMV)}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-red-600">
                    -{formatCurrency(detailedTransactionData.reduce((sum, item) => sum + item.discount, 0))}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(detailedTransactionData.reduce((sum, item) => sum + item.netRevenue, 0))}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-[#1e40af]">
                    {formatCurrency(totalCommission)}
                  </td>
                  <td className="py-4 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}