// pages/personnel/dashboard.jsx
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import PersonnelHeader from "@/components/personnel/PersonnelHeader";
import AnalysisImprovementHeader from "@/components/common/AnalysisImprovementHeader";
import QuestionnaireScore from "@/components/common/QuestionnaireScore";
import EmployeeSatisfactionHeatmap from "@/components/common/EmployeeSatisfactionHeatmap";

// 回答率コンポーネント
const ResponseRateComponent = dynamic(
  () => import('@/components/personnel/ResponseRateComponent'),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center p-6">読み込み中...</div>
  }
);

export default function PersonnelDashboardPage() {
  // QuestionnaireScore用の状態管理
  const [selectedYears, setSelectedYears] = useState(1);
  
  // QuestionnaireScore用のダミーデータ
  const scoreData = {
    score: 72,
    prevDiff: 5,
    companyAvg: 68,
    rating: 56,
    ratingLabel: "BB",
    history: [
      { date: "2023/01", score: 60 },
      { date: "2023/02", score: 62 },
      { date: "2023/03", score: 65 },
      { date: "2023/04", score: 68 },
      { date: "2023/05", score: 66 },
      { date: "2023/06", score: 70 },
      { date: "2023/07", score: 69 },
      { date: "2023/08", score: 71 },
      { date: "2023/09", score: 68 },
      { date: "2023/10", score: 70 },
      { date: "2023/11", score: 67 },
      { date: "2023/12", score: 72 }
    ]
  };

  // EmployeeSatisfactionHeatmap用のデータ
  // デフォルト質問のカテゴリー（固定）
  const defaultCategories = [
    { id: 1, category: '顧客基盤の安定性' },
    { id: 2, category: '理念戦略への納得感' },
    { id: 3, category: '社会的貢献' },
    { id: 4, category: '責任と顧客・社会への貢献' },
    { id: 5, category: '連帯感と相互尊重' },
    { id: 6, category: '魅力的な上司' },
    { id: 7, category: '勤務地や会社設備の魅力' },
    { id: 8, category: '評価・給与と柔軟な働き方' },
    { id: 9, category: '顧客ニーズや事業戦略の伝達' },
    { id: 10, category: '上司や会社からの理解' },
    { id: 11, category: '公平な評価' },
    { id: 12, category: '上司からの適切な教育・支援' },
    { id: 13, category: '顧客の期待を上回る提案' },
    { id: 14, category: '具体的な目標の共有' },
    { id: 15, category: '未来に向けた活動' },
    { id: 16, category: 'ナレッジの標準化' },
  ]

  // 追加質問のカテゴリー（組織ごとに異なる）
  const customCategories = [
    { id: 101, category: 'リモートワークの満足度' },
    { id: 102, category: '部署間コミュニケーション' },
    { id: 103, category: '新しい技術導入への理解' },
  ]

  // サンプルデータ - 各部署にIDを追加
  const heatmapData = [
    {
      id: 'all',  // 部署ID追加
      department: '全社',
      score: 58.9,
      gap: -1.8,
      defaultCategories: {
        顧客基盤の安定性: -0.7,
        理念戦略への納得感: -1.5,
        社会的貢献: -1.2,
        '責任と顧客・社会への貢献': -1.5,
        連帯感と相互尊重: -1.2,
        魅力的な上司: -1.8,
        勤務地や会社設備の魅力: -4.0,
        '評価・給与と柔軟な働き方': -3.7,
        顧客ニーズや事業戦略の伝達: -2.0,
        上司や会社からの理解: -0.8,
        公平な評価: -1.6,
        '上司からの適切な教育・支援': -0.4,
        顧客の期待を上回る提案: -1.5,
        具体的な目標の共有: -3.6,
        未来に向けた活動: -2.2,
        ナレッジの標準化: -1.4,
      },
      customCategories: {
        リモートワークの満足度: -2.1,
        部署間コミュニケーション: -1.8,
        新しい技術導入への理解: -0.9,
      },
    },
    {
      id: 'admin',  // 部署ID追加
      department: '管理部',
      score: 59.1,
      gap: -1.9,
      defaultCategories: {
        顧客基盤の安定性: 0.6,
        理念戦略への納得感: -0.7,
        社会的貢献: -1.9,
        '責任と顧客・社会への貢献': -1.2,
        連帯感と相互尊重: -2.0,
        魅力的な上司: -1.9,
        勤務地や会社設備の魅力: -4.7,
        '評価・給与と柔軟な働き方': -4.6,
        顧客ニーズや事業戦略の伝達: -3.5,
        上司や会社からの理解: 0.1,
        公平な評価: -2.4,
        '上司からの適切な教育・支援': -0.8,
        顧客の期待を上回る提案: -1.5,
        具体的な目標の共有: -2.3,
        未来に向けた活動: -1.5,
        ナレッジの標準化: -1.5,
      },
      customCategories: {
        リモートワークの満足度: -1.2,
        部署間コミュニケーション: -2.3,
        新しい技術導入への理解: -1.5,
      },
    },
    {
      id: 'marketing',  // 部署ID追加
      department: 'マーケティング部',
      score: 55.8,
      gap: -1.4,
      defaultCategories: {
        顧客基盤の安定性: -3.6,
        理念戦略への納得感: -3.4,
        社会的貢献: 0,
        '責任と顧客・社会への貢献': -0.4,
        連帯感と相互尊重: -0.4,
        魅力的な上司: -1.9,
        勤務地や会社設備の魅力: -4.0,
        '評価・給与と柔軟な働き方': -3.0,
        顧客ニーズや事業戦略の伝達: 0.5,
        上司や会社からの理解: 0.5,
        公平な評価: 1.3,
        '上司からの適切な教育・支援': -0.7,
        顧客の期待を上回る提案: -2.1,
        具体的な目標の共有: -4.3,
        未来に向けた活動: -0.9,
        ナレッジの標準化: -0.6,
      },
      customCategories: {
        リモートワークの満足度: 0.8,
        部署間コミュニケーション: -3.5,
        新しい技術導入への理解: 1.4,
      },
    },
    {
      id: 'sales',  // 部署ID追加
      department: '営業部',
      score: 56.5,
      gap: -1.9,
      defaultCategories: {
        顧客基盤の安定性: -1.0,
        理念戦略への納得感: -1.3,
        社会的貢献: -1.2,
        '責任と顧客・社会への貢献': -1.7,
        連帯感と相互尊重: -0.9,
        魅力的な上司: -2.2,
        勤務地や会社設備の魅力: -3.7,
        '評価・給与と柔軟な働き方': -3.3,
        顧客ニーズや事業戦略の伝達: -1.6,
        上司や会社からの理解: -1.2,
        公平な評価: -1.8,
        '上司からの適切な教育・支援': -0.2,
        顧客の期待を上回る提案: -1.8,
        具体的な目標の共有: -4.3,
        未来に向けた活動: -3.2,
        ナレッジの標準化: -1.8,
      },
      customCategories: {
        リモートワークの満足度: -2.7,
        部署間コミュニケーション: -0.6,
        新しい技術導入への理解: -2.2,
      },
    },
  ]

  return (
    <div className="min-h-screen bg-brand-lightGray">
      {/* 人事部専用ヘッダーを使用 */}
      <PersonnelHeader />
      <AnalysisImprovementHeader 
        analysisPath="/personnel/dashboard" 
        improvementPath="/personnel/measures" 
      />
      
      <main className="p-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-brand-darkBlue">
            大東亜全世界同盟株式会社の全社データ
          </h1>
        </div>
        
        {/* QuestionnaireScoreコンポーネント */}
        <div className="mb-8">
          <QuestionnaireScore 
            score={scoreData.score}
            prevDiff={scoreData.prevDiff}
            companyAvg={scoreData.companyAvg}
            rating={scoreData.rating}
            ratingLabel={scoreData.ratingLabel}
            history={scoreData.history}
            setSelectedYears={setSelectedYears}
            selectedYears={selectedYears}
          />
        </div>
        
        {/* 統合型回答率コンポーネント */}
        <ResponseRateComponent />
        
        {/* 従業員満足度ヒートマップ */}
        <h2 className="text-xl font-bold text-brand-darkBlue mt-10">
        最新サーベイスコア詳細
      </h2>
        <div className="mt-4">
          <EmployeeSatisfactionHeatmap 
            defaultCategories={defaultCategories}
            customCategories={customCategories}
            data={heatmapData}
          />
        </div>
      </main>
    </div>
  );
}