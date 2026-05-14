const data = [
  { date: '03/20', amount: 4200 },
  { date: '03/21', amount: 5800 },
  { date: '03/22', amount: 4500 },
  { date: '03/23', amount: 6200 },
  { date: '03/24', amount: 7100 },
  { date: '03/25', amount: 6800 },
  { date: '03/26', amount: 8300 },
];

export function FundingChart() {
  const maxValue = 10000;
  const width = 900;
  const height = 320;
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth + padding.left;
    const y = height - padding.bottom - (item.amount / maxValue) * chartHeight;
    return { x, y, ...item };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const yTicks = [0, 2500, 5000, 7500, 10000];

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">최근 펀딩 현황</h2>
        <p className="text-sm text-gray-500 mt-1.5">지난 7일간 펀딩 추이</p>
      </div>
      
      <div className="relative">
        <svg width={width} height={height} className="overflow-visible">
          {/* Y-axis ticks and labels */}
          {yTicks.map((tick, idx) => {
            const y = height - padding.bottom - (tick / maxValue) * chartHeight;
            return (
              <g key={`y-tick-${tick}-${idx}`}>
                <line
                  x1={padding.left - 5}
                  y1={y}
                  x2={padding.left}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="#9ca3af"
                  fontSize="13"
                  fontWeight="500"
                >
                  {tick / 1000}K
                </text>
              </g>
            );
          })}

          {/* X-axis ticks and labels */}
          {points.map((point, idx) => (
            <g key={`x-tick-${point.date}-${idx}`}>
              <line
                x1={point.x}
                y1={height - padding.bottom}
                x2={point.x}
                y2={height - padding.bottom + 5}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={point.x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="13"
                fontWeight="500"
              >
                {point.date}
              </text>
            </g>
          ))}

          {/* Y-axis line */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* X-axis line */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke="#1e40af"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive dots */}
          {points.map((point, idx) => (
            <g key={`dot-${point.date}-${idx}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#1e40af"
                strokeWidth="2"
                className="cursor-pointer hover:r-6 transition-all"
              />
              <title>{`${point.date}: ₩${point.amount.toLocaleString()}`}</title>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
