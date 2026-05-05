import { Check } from 'lucide-react';

interface TimelineStage {
  stage: string;
  label: string;
  completed: boolean;
}

interface ProductionTimelineProps {
  stages: TimelineStage[];
}

export function ProductionTimeline({ stages }: ProductionTimelineProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">생산 단계</h3>
      <div className="flex items-center justify-between relative">
        {/* 배경 라인 */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-blue-900 transition-all duration-500"
          style={{
            width: `${
              (stages.filter((s) => s.completed).length / (stages.length - 1)) * 100
            }%`,
          }}
        />

        {/* 단계들 */}
        {stages.map((stage, index) => (
          <div key={stage.stage} className="relative flex flex-col items-center z-10">
            {/* 원형 인디케이터 */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                stage.completed
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}
            >
              {stage.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            {/* 레이블 */}
            <p
              className={`mt-2 text-sm text-center whitespace-nowrap ${
                stage.completed ? 'text-gray-900 font-semibold' : 'text-gray-500'
              }`}
            >
              {stage.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
