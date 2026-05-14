import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminStatsCards } from './SuperAdminStatsCards';
import { GMVChart } from './GMVChart';
import { SellerApplicationsTable } from './SellerApplicationsTable';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">Super Admin Dashboard</h1>
          <p className="text-gray-500">re:own 플랫폼 통합 관리 콘솔</p>
        </div>
        
        <SuperAdminStatsCards />
        
        <div className="mb-6">
          <GMVChart />
        </div>
        
        <SellerApplicationsTable />
      </main>
    </div>
  );
}