import { Sparkles, Plus, Award } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LimitedEditionManagement() {
  const { roleType } = useAuth();
  const isDesigner = roleType === "DESIGNER";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-500" />
            디자이너 한정판
          </h1>
          <p className="text-gray-500 mt-1">특별한 에디션 컬렉션을 관리하세요</p>
        </div>
        {isDesigner && (
          <a
            href="/seller/limited-edition/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            신규 한정판 등록
          </a>
        )}
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-12 border-2 border-amber-200 text-center">
        <div className="inline-flex p-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-xl mb-6">
          <Award className="w-16 h-16 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">등록된 한정판이 없습니다</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          특별한 에디션 컬렉션으로 브랜드의 가치를 높이고<br />
          컬렉터들에게 독점적인 경험을 선사하세요
        </p>
        {isDesigner ? (
          <a
            href="/seller/limited-edition/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            첫 한정판 컬렉션 만들기
          </a>
        ) : (
          <div className="inline-block">
            <p className="text-sm text-amber-800 bg-white px-6 py-3 rounded-lg border-2 border-amber-300 shadow-sm">
              💡 디자이너 파트너십이 필요합니다. 고객센터로 문의하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
