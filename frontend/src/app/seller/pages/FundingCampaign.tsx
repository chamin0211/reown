import { Target, Plus, Rocket } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function FundingCampaign() {
  const { roleType } = useAuth();
  const isDesigner = roleType === "DESIGNER";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">펀딩 캠페인</h1>
          <p className="text-gray-500 mt-1">진행 중인 펀딩 캠페인을 관리하세요</p>
        </div>
        {isDesigner && (
          <a
            href="/funding/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Rocket className="w-5 h-5" />
            신규 펀딩 시작
          </a>
        )}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-12 border border-green-200 text-center">
        <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">진행 중인 펀딩이 없습니다</h3>
        <p className="text-gray-600 mb-6">
          펀딩 방식으로 상품을 등록하고 지속 가능한 생산을 시작하세요
        </p>
        {isDesigner ? (
          <a
            href="/funding/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Rocket className="w-5 h-5" />
            첫 펀딩 프로젝트 만들기
          </a>
        ) : (
          <div className="inline-block">
            <p className="text-sm text-gray-500 bg-white px-6 py-3 rounded-lg border border-gray-300">
              💡 펀딩 프로젝트는 디자이너 권한이 필요합니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}