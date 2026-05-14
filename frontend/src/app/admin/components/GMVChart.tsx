const data = [
  { date: '02/26', gmv: 3200 },
  { date: '02/27', gmv: 3800 },
  { date: '02/28', gmv: 3500 },
  { date: '02/29', gmv: 4100 },
  { date: '03/01', gmv: 4800 },
  { date: '03/02', gmv: 4200 },
  { date: '03/03', gmv: 3900 },
  { date: '03/04', gmv: 4500 },
  { date: '03/05', gmv: 5200 },
  { date: '03/06', gmv: 4900 },
  { date: '03/07', gmv: 5600 },
  { date: '03/08', gmv: 5100 },
  { date: '03/09', gmv: 4700 },
  { date: '03/10', gmv: 5400 },
  { date: '03/11', gmv: 6200 },
  { date: '03/12', gmv: 5800 },
  { date: '03/13', gmv: 6500 },
  { date: '03/14', gmv: 6100 },
  { date: '03/15', gmv: 5900 },
  { date: '03/16', gmv: 6800 },
  { date: '03/17', gmv: 7200 },
  { date: '03/18', gmv: 6900 },
  { date: '03/19', gmv: 7500 },
  { date: '03/20', gmv: 7100 },
  { date: '03/21', gmv: 7800 },
  { date: '03/22', gmv: 7400 },
  { date: '03/23', gmv: 8100 },
  { date: '03/24', gmv: 7900 },
  { date: '03/25', gmv: 8600 },
  { date: '03/26', gmv: 8300 },
];

export function GMVChart() {
  const maxValue = 10000;
  const width = 1100;
  const height = 320;
  const padding = { top: 20, right: 40, bottom: 40, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Only show every 5th label to avoid crowding
  const showLabel = (index: number) => index % 5 === 0 || index === data.length - 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth + padding.left;
    const y = height - padding.bottom - (item.gmv / maxValue) * chartHeight;
    return { x, y, ...item };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Create gradient area path
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  const yTicks = [0, 2500, 5000, 7500, 10000];

  // Calculate summary stats
  const totalGMV = data.reduce((sum, item) => sum + item.gmv, 0);
  const avgGMV = Math.round(totalGMV / data.length);
  const maxGMV = Math.max(...data.map(d => d.gmv));

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">플랫폼 전체 거래액 (GMV) 추이</h2>
          <p className="text-sm text-gray-500 mt-1.5">최근 30일간 총 거래액</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-500">총 GMV</p>
            <p className="text-lg font-bold text-blue-600">₩{(totalGMV / 10000).toFixed(1)}억</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">일평균</p>
            <p className="text-lg font-bold text-purple-600">₩{(avgGMV / 10).toFixed(0)}백만</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">최고</p>
            <p className="text-lg font-bold text-green-600">₩{(maxGMV / 10).toFixed(0)}백만</p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id="gmvGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y-axis ticks and labels */}
          {yTicks.map((tick, idx) => {
            const y = height - padding.bottom - (tick / maxValue) * chartHeight;
            return (
              <g key={`y-tick-gmv-${tick}-${idx}`}>
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
                  {tick / 100}백만
                </text>
              </g>
            );
          })}

          {/* X-axis ticks and labels */}
          {points.map((point, idx) => (
            <g key={`x-tick-gmv-${point.date}-${idx}`}>
              {showLabel(idx) && (
                <>
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
                    fontSize="12"
                    fontWeight="500"
                  >
                    {point.date}
                  </text>
                </>
              )}
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

          {/* Gradient area */}
          <path
            d={areaPath}
            fill="url(#gmvGradient)"
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

          {/* Interactive dots on hover area */}
          {points.map((point, idx) => (
            <g key={`dot-gmv-${point.date}-${idx}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#1e40af"
                strokeWidth="2"
                className="cursor-pointer"
              />
              <title>{`${point.date}: ₩${(point.gmv / 10).toFixed(0)}백만`}</title>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
