import React from "react";

const QuadrantMatrixDetails = ({ selectedDept, departmentData }) => {
  // 各象限の意味と改善策
  const quadrantInfo = [
    {
      title: "強み",
      color: "bg-[rgba(252,127,122,0.3)] border-l-4 border-[rgba(252,127,122,0.7)]", // Coral (薄め)
      description: "期待も実感も高い。成功要因を分析し、他の領域にも展開。",
    },
    {
      title: "課題",
      color: "bg-[rgba(0,163,179,0.3)] border-l-4 border-[rgba(0,163,179,0.7)]", // Cyan (薄め)
      description: "期待は高いが実感が低い。重点的に改善すべき領域。",
    },
    {
      title: "隠れた強み",
      color: "bg-[rgba(242,151,89,0.3)] border-l-4 border-[rgba(242,151,89,0.7)]", // Orange (薄め)
      description: "実感は高いが期待が低い。社内の良さが伝わっていない可能性。",
    },
    {
      title: "優先度低",
      color: "bg-[rgba(55,65,81,0.2)] border-l-4 border-[rgba(55,65,81,0.6)]", // Dark Gray (薄め)
      description: "期待も実感も低い。優先度は低いが将来的に改善の可能性。",
    },
  ];

  // 部門ごとの強み・課題データは親コンポーネントから props 経由で受け取る
  const selectedData = departmentData[selectedDept] || {
    strong: [],
    weak: [],
    summary: "データが不足しています。",
  };

  return (
    <div className="flex flex-col text-black space-y-4 pt-14 w-[850px]">
      {/* 4象限マトリクスの見方 */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">4象限マトリクスの見方</h3>
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-2 gap-2">
          {[
            quadrantInfo[1], // 強み
            quadrantInfo[0], // 課題
            quadrantInfo[3], // 優先度低
            quadrantInfo[2], // 隠れた強み
          ].map((info, index) => (
            <div key={index} className={`p-2 rounded ${info.color}`}>
              <p className="text-sm font-semibold">{info.title}</p>
              <p className="text-xs text-gray-700">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 部門ごとのサマリー */}
      <h3 className="text-lg font-bold text-gray-900 pt-2">{selectedDept} の概要</h3>
      <div className="p-4 bg-white shadow-md rounded-lg h-60">
        <p className="text-sm text-gray-700">{selectedData.summary}</p>
      </div>

      {/* 凡例 */}
      <div className="text-sm text-brand-darkBlue">
        <p>※ 各ポイントは{selectedDept}の項目を表しています</p>
        <p>※ 実感スコアは1〜5の範囲で、値が高いほど良い評価を示します</p>
        <p>※ 期待スコアは1〜5の範囲で、値が高いほど重要度が高いことを示します</p>
      </div>
    </div>
  );
};

export default QuadrantMatrixDetails;