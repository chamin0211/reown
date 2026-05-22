import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SellerApplicationsTable } from './SellerApplicationsTable';

export function SellerOnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">Seller Onboarding</h1>
          <p className="text-gray-500">브랜드 입점 승인과 디자이너 셀러 권한을 관리합니다.</p>
        </div>

        <SellerApplicationsTable />
      </main>
    </div>
  );
}
