import { SuperAdminSidebar } from './SuperAdminSidebar';

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1.5">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
        
        <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">페이지 준비중</h2>
            <p className="text-gray-600">이 기능은 현재 개발 중입니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
}