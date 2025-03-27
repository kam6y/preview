// front/src/components/manager/4QuadrantMatrix.js
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  ReferenceArea,
  LabelList
} from 'recharts';

// ブランドカラー定義
const brandColors = {
  darkBlue: '#004259',
  teal: '#178394',
  cyan: '#00A3B3',
  orange: '#F29759',
  coral: '#FC7F7A',
  lightGray: '#F1F4F5',
  
  // 半透明バージョン（象限用）
  iceBlock: 'rgba(0, 163, 179, 0.3)', // Cyan
  interLink: 'rgba(252, 127, 122, 0.3)', // Coral
  lowPriority: 'rgba(55, 65, 81, 0.3)', // Dark Gray
  coreStrategy: 'rgba(242, 151, 89, 0.3)', // Orange
};

// 改良されたカスタムラベルコンポーネント
const ImprovedCustomizedLabel = (props) => {
  const { x, y, value } = props;
  
  if (!value) return null;
  
  return (
    <g>
      <text 
        x={x} 
        y={y - 15} 
        textAnchor="middle" 
        fill={brandColors.darkBlue}
        fontSize={12}
        fontWeight="500"
        dominantBaseline="middle"
        style={{ textShadow: '0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white' }}
      >
        {value}
      </text>
    </g>
  );
};

// 象限ラベルコンポーネント
const QuadrantLabels = () => {
  return (
    <g className="quadrant-labels">
      {/* 課題（左上） */}
      <text 
        x={2} 
        y={4} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill={brandColors.darkBlue}
        fontSize={16}
        fontWeight="bold"
      >
        課題
      </text>
      
      {/* 強み（右上） */}
      <text 
        x={4} 
        y={4} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill={brandColors.darkBlue}
        fontSize={16}
        fontWeight="bold"
      >
        強み
      </text>
      
      {/* 優先度低（左下） */}
      <text 
        x={2} 
        y={2} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill={brandColors.darkBlue}
        fontSize={16}
        fontWeight="bold"
      >
        優先度低
      </text>
      
      {/* 隠れた強み（右下） */}
      <text 
        x={4} 
        y={2} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill={brandColors.darkBlue}
        fontSize={16}
        fontWeight="bold"
      >
        隠れた強み
      </text>
    </g>
  );
};

const QuadrantMatrix = ({ selectedDept, setSelectedDept, categories, departmentData }) => {
  // props から受け取るように変更
  
  return (
    <div className="w-full ">
      {/* タブボタン */}
      <div className="flex space-x-4 mb-4">
        {Object.keys(departmentData).map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              selectedDept === dept
                ? 'bg-brand-darkBlue text-white'
                : 'bg-brand-cyan text-white hover:bg-brand-teal'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* 4象限マトリクスのタイトル */}
      <p className="text-xl font-bold text-brand-darkBlue ">
        4象限マトリクス - {selectedDept}
      </p>
      
      {/* マトリクス本体 */}
      <div className="w-full aspect-square border border-brand-lightGray  bg-white rounded-lg shadow mt-5 py-1 mb-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 40, right: 50, bottom: 40, left: 40 }}>
            {/* 4象限の背景色 */}
            <ReferenceArea
              x1={1}
              x2={3}
              y1={3}
              y2={5}
              fill={brandColors.iceBlock}
              ifOverflow="hidden"
              label={{ 
                value: "課題", 
                position: "center", 
                fill: brandColors.darkBlue,
                fontSize: 16,
                fontWeight: "bold"
              }}
            />
            <ReferenceArea
              x1={3}
              x2={5}
              y1={3}
              y2={5}
              fill={brandColors.interLink}
              ifOverflow="hidden"
              label={{ 
                value: "強み", 
                position: "center", 
                fill: brandColors.darkBlue,
                fontSize: 16,
                fontWeight: "bold"
              }}
            />
            <ReferenceArea
              x1={1}
              x2={3}
              y1={1}
              y2={3}
              fill={brandColors.lowPriority}
              ifOverflow="hidden"
              label={{ 
                value: "優先度低", 
                position: "center", 
                fill: brandColors.darkBlue,
                fontSize: 16,
                fontWeight: "bold"
              }}
            />
            <ReferenceArea
              x1={3}
              x2={5}
              y1={1}
              y2={3}
              fill={brandColors.coreStrategy}
              ifOverflow="hidden"
              label={{ 
                value: "隠れた強み", 
                position: "center", 
                fill: brandColors.darkBlue,
                fontSize: 16,
                fontWeight: "bold"
              }}
            />

            {/* X・Y 軸の基準線（中央） */}
            <ReferenceLine x={3} stroke="#666" strokeWidth={1} />
            <ReferenceLine y={3} stroke="#666" strokeWidth={1} />

            {/* y = x の直線 */}
            <ReferenceLine
              segment={[
                { x: 1, y: 1 },
                { x: 5, y: 5 },
              ]}
              stroke="#666"
              strokeDasharray="5 5"
            />

            <XAxis
              type="number"
              dataKey="x"
              domain={[1, 5]}
              tickCount={5}
              allowDataOverflow={false}
              stroke={brandColors.darkBlue}
            >
              <Label 
                value="実感" 
                position="insideBottom" 
                offset={-15}
                fill={brandColors.darkBlue}
                style={{ fontWeight: "bold", fontSize: 14 }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[1, 5]}
              tickCount={5}
              allowDataOverflow={false}
              stroke={brandColors.darkBlue}
            >
              <Label 
                value="期待" 
                position="insideLeft" 
                angle={-90}
                offset={-15}
                fill={brandColors.darkBlue}
                style={{ fontWeight: "bold", fontSize: 14 }}
              />
            </YAxis>

            {/* ツールチップ */}
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-brand-teal rounded-md shadow-lg">
                    <p className="font-bold text-brand-darkBlue mb-1">{data.category}</p>
                    <p className="text-brand-teal">実感: {data.x.toFixed(1)}</p>
                    <p className="text-brand-teal">期待: {data.y.toFixed(1)}</p>
                    <p className="text-xs text-brand-darkBlue mt-1">差: {(data.y - data.x).toFixed(1)}</p>
                  </div>
                );
              }}
            />

            {/* データポイント */}
            <Scatter
              name={selectedDept}
              data={departmentData[selectedDept] || []}
              fill={brandColors.darkBlue}
              stroke="#fff"
              strokeWidth={1}
              isAnimationActive={true}
            >
              <LabelList 
                dataKey="category" 
                position="top" 
                content={ImprovedCustomizedLabel}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuadrantMatrix;