import { useState } from 'react';
import { VaultCertificateCard } from '../components/VaultCertificateCard';
import { CertificateDetailModal } from '../components/CertificateDetailModal';
import { OwnershipTransferFlow } from '../components/OwnershipTransferFlow';
import { mockCertificates, DigitalCertificate, OwnershipStatus } from '../data/digitalCertificate';
import { Header } from '../components/Header';
import { Shield, Filter, Search, TrendingUp, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

export function TheVaultPage() {
  // 현재 로그인한 유저 (실제로는 인증 시스템에서 가져옴)
  const currentUserId = 'user-kim-12345';

  // 상태 관리
  const [selectedCertificate, setSelectedCertificate] = useState<DigitalCertificate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OwnershipStatus | 'ALL'>('ALL');

  // 유저의 보증서 필터링
  const userCertificates = mockCertificates.filter((cert) => {
    const matchesSearch = 
      cert.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || cert.ownershipStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 통계
  const stats = {
    total: mockCertificates.length,
    owned: mockCertificates.filter((c) => c.ownershipStatus === 'OWNED').length,
    activated: mockCertificates.filter((c) => c.nfcActivated).length,
    transferring: mockCertificates.filter((c) => c.ownershipStatus === 'TRANSFERRING').length,
  };

  const handleCardClick = (certificate: DigitalCertificate) => {
    setSelectedCertificate(certificate);
    setIsDetailModalOpen(true);
  };

  const handleTransferClick = () => {
    setIsDetailModalOpen(false);
    setIsTransferModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-900" />
            <h1 className="text-3xl font-bold text-gray-900">The Vault</h1>
          </div>
          <p className="text-gray-600">
            re:own 디지털 보증서를 안전하게 보관하고 관리하는 가상 금고입니다
          </p>
        </div>

        {/* 안내 메시지 */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-gray-700">
            <strong>디지털 보증서란?</strong> NFC 칩과 블록체인 기술을 결합하여 제품의 정품 여부와 
            소유권을 증명하는 혁신적인 시스템입니다. 제품을 구매하면 자동으로 디지털 보증서가 발급되며, 
            NFC 태그를 스캔하여 정품 인증을 완료할 수 있습니다.
          </AlertDescription>
        </Alert>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="전체 보증서"
            value={stats.total}
            icon={<Shield className="w-5 h-5 text-gray-600" />}
            bgColor="bg-gray-50"
          />
          <StatCard
            label="소유 완료"
            value={stats.owned}
            icon={<Shield className="w-5 h-5 text-green-600" />}
            bgColor="bg-green-50"
          />
          <StatCard
            label="정품 인증"
            value={stats.activated}
            icon={<Shield className="w-5 h-5 text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            label="이전 진행중"
            value={stats.transferring}
            icon={<TrendingUp className="w-5 h-5 text-yellow-600" />}
            bgColor="bg-yellow-50"
          />
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="상품명, 브랜드, 시리얼 넘버로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OwnershipStatus | 'ALL')}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체 상태</SelectItem>
              <SelectItem value="ISSUED">미활성화</SelectItem>
              <SelectItem value="ACTIVATED">정품 인증</SelectItem>
              <SelectItem value="TRANSFERRING">이전 진행중</SelectItem>
              <SelectItem value="OWNED">소유 완료</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 보증서 그리드 */}
        {userCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userCertificates.map((certificate) => (
              <VaultCertificateCard
                key={certificate.certificateId}
                certificate={certificate}
                onClick={() => handleCardClick(certificate)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-400">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}

        {/* 빈 상태 (보증서가 하나도 없을 때) */}
        {mockCertificates.length === 0 && (
          <div className="text-center py-16">
            <Shield className="w-24 h-24 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              아직 보증서가 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              re:own에서 상품을 구매하면 디지털 보증서가 자동으로 발급됩니다
            </p>
            <Button className="bg-blue-900 hover:bg-blue-800">
              쇼핑하러 가기
            </Button>
          </div>
        )}
      </main>

      {/* 모달 */}
      <CertificateDetailModal
        certificate={selectedCertificate}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {selectedCertificate && (
        <OwnershipTransferFlow
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          certificateId={selectedCertificate.certificateId}
          productName={selectedCertificate.productName}
          fromOwner={selectedCertificate.currentOwner}
          toOwner="user-buyer-99999"
        />
      )}
    </div>
  );
}

// 통계 카드 컴포넌트
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

function StatCard({ label, value, icon, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
