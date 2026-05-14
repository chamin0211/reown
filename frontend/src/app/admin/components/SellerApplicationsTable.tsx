import { Eye } from 'lucide-react';
import { Link } from 'react-router';

interface SellerApplication {
  id: string;
  brandName: string;
  applicant: string;
  applicantEmail: string;
  applicationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  businessType: string;
}

const mockApplications: SellerApplication[] = [
  {
    id: 'APP-2024-012',
    brandName: '럭셔리 컬렉션',
    applicant: '김명품',
    applicantEmail: 'luxury@example.com',
    applicationDate: '2024.03.27',
    status: 'PENDING',
    businessType: '명품 리셀',
  },
  {
    id: 'APP-2024-011',
    brandName: '스니커즈 하우스',
    applicant: '박운동화',
    applicantEmail: 'sneakers@example.com',
    applicationDate: '2024.03.26',
    status: 'PENDING',
    businessType: '스니커즈 전문',
  },
  {
    id: 'APP-2024-010',
    brandName: '디자이너스 스튜디오',
    applicant: '이창작',
    applicantEmail: 'designer@example.com',
    applicationDate: '2024.03.26',
    status: 'APPROVED',
    businessType: '디자이너 브랜드',
  },
  {
    id: 'APP-2024-009',
    brandName: '빈티지 마켓',
    applicant: '최골동',
    applicantEmail: 'vintage@example.com',
    applicationDate: '2024.03.25',
    status: 'PENDING',
    businessType: '빈티지 전문',
  },
  {
    id: 'APP-2024-008',
    brandName: '프리미엄 가방',
    applicant: '정핸드백',
    applicantEmail: 'bags@example.com',
    applicationDate: '2024.03.24',
    status: 'REJECTED',
    businessType: '가방 전문',
  },
];

export function SellerApplicationsTable() {
  const getStatusBadge = (status: string) => {
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'APPROVED': 'bg-green-100 text-green-700 border-green-200',
      'REJECTED': 'bg-red-100 text-red-700 border-red-200',
    };
    const labels = {
      'PENDING': '검토대기',
      'APPROVED': '승인완료',
      'REJECTED': '반려',
    };
    return { style: styles[status as keyof typeof styles], label: labels[status as keyof typeof labels] };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">최근 입점 신청 브랜드</h2>
            <p className="text-sm text-gray-500 mt-1">심사가 필요한 신규 셀러 입점 신청 목록</p>
          </div>
          <Link
            to="/seller/onboarding"
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-sm"
          >
            전체 보기
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                신청 ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                브랜드명
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                신청자
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                비즈니스 유형
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                신청일
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                심사상태
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockApplications.map((application) => {
              const statusInfo = getStatusBadge(application.status);
              return (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600">{application.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{application.brandName}</p>
                      <p className="text-xs text-gray-500">{application.applicantEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {application.applicant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{application.businessType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {application.applicationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${statusInfo.style}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/seller/onboarding/${application.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      <Eye size={16} />
                      검토하기
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">총 {mockApplications.length}개 신청</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            검토 대기: <span className="font-bold text-yellow-600">{mockApplications.filter(a => a.status === 'PENDING').length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
