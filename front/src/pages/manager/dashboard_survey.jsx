import { useState, useEffect } from 'react'
import ManagerHeader from '../../components/manager/ManagerHeader'
import AnalysisImprovementHeader from "@/components/common/AnalysisImprovementHeader";
import QuestionnaireScore from '../../components/common/QuestionnaireScore'
import ResponseRateCard from '../../components/manager/ResponseRateCard'
import DepartmentScoreTable from '../../components/manager/DepartmentScoreTable'
import QuadrantMatrix from '../../components/manager/4QuadrantMatrix'
import QuadrantMatrixDetails from '../../components/manager/QuadrantMatrixDetails'
import EmployeeSatisfactionHeatmap from '../../components/common/EmployeeSatisfactionHeatmap'
import LastUpdatedInfo from '../../components/common/LastUpdatedInfo'

const generateHistoryData = (endDate, years) => {
  const data = []
  let date = new Date(endDate)
  for (let i = 0; i <= years * 2 + 1; i++) {
    data.unshift({
      date: date.toISOString().split('T')[0],
      score: Math.floor(Math.random() * 101),
      rating: ['B', 'BB', 'BBB'][Math.floor(Math.random() * 3)],
    })
    date.setMonth(date.getMonth() - 6)
  }
  return data
}

// 部署スコアのダミーデータ
const departmentScores = [
  { id: "sales_a", name: "営業部A", score: 41, rating: "BB", diff: -5, prevDiff: -2 },
  { id: "sales_b", name: "営業部B", score: 55, rating: "BBB", diff: +3, prevDiff: +4 },
  { id: "sales_c", name: "営業部C", score: 62, rating: "A", diff: +10, prevDiff: -1 },
]

// ResponseRateCard 用のダミーデータ
const responseRates = [
  { label: "全社あ", rate: 70 },
  { label: "営業部営業課", rate: 40 },
  { label: "組織B", rate: 60 },
  { label: "組織C", rate: 50 },
]

const ManagerIssue = () => {
  const [selectedYears, setSelectedYears] = useState(1)
  const [fullHistory, setFullHistory] = useState(null)
  const [latestScore, setLatestScore] = useState(null)
  const [selectedDept, setSelectedDept] = useState('営業部')
  const [showHeatmap, setShowHeatmap] = useState(true)

  // 16項目のデータ定義（各カテゴリー）
  const categories = [
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

  // 仮データ（部署ごとの4象限マトリクス用データ）
  const departmentData = {
    営業部: categories.map((item) => ({
      id: item.id,
      category: item.category,
      x: Math.random() * 4 + 1,
      y: Math.random() * 4 + 1,
    })),
  }

  // 部門ごとの強み・課題データ
  const departmentSummaryData = {
    営業部: {
      strong: ["顧客対応", "連携意識"],
      weak: ["評価・給与", "事業戦略の伝達"],
      summary: "営業部は、顧客対応や連携意識の強さが評価されています。ただし、評価制度や事業戦略の伝達が課題となっており、従業員の満足度向上が求められています。",
    },
  }

  // EmployeeSatisfactionHeatmap 用のデータ
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

  // サンプルデータ - 各部署のヒートマップ用データ
  const heatmapData = [
    {
      id: 'all',
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
      id: 'sales',
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

  useEffect(() => {
    const generatedData = generateHistoryData('2025-02-07', 5)
    setFullHistory(generatedData)
    const filteredHistory = generatedData.slice(-(selectedYears * 2 + 1))
    setLatestScore(
      filteredHistory.length > 0 ? filteredHistory[filteredHistory.length - 1].score : 0
    )
  }, [selectedYears])

  if (!fullHistory || latestScore === null) return null

  const questionnaireData = {
    score: latestScore,
    prevDiff: '+0.5',
    companyAvg: '58.9 (-3.6)',
    rating: 55,
    ratingLabel: 'BB',
    history: fullHistory,
    setSelectedYears,
    selectedYears,
  }

  return (
    <div className="bg-brand-lightGray min-h-screen flex flex-col">
      {/* ヘッダー */}
      <ManagerHeader showNav={true} showTenantName={true} />
      <AnalysisImprovementHeader 
        analysisPath="/manager/dashboard_survey" 
        improvementPath="/manager/dashboard_improvement" 
      />
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4 pl-6 pt-2 text-gray-900">
          あなたの組織
        </h2>
        <LastUpdatedInfo history={fullHistory} />
      </div>
      
      <QuestionnaireScore {...questionnaireData} />

      <div className="w-full flex flex-wrap gap-4 p-6">
        <div className="flex-1">
          {/* ResponseRateCard にダミーデータを props 経由で渡す */}
          <ResponseRateCard responseRates={responseRates} />
        </div>
        <div className="flex-1">
          <DepartmentScoreTable departmentScores={departmentScores} />
        </div>
      </div>

      {/* 4象限マトリクスと詳細情報を横並びに配置 */}
      <div className="mt-6 p-6 w-full flex">
        {/* 左側：4象限マトリクス */}
        <div className="w-2/5 pr-10">
          <QuadrantMatrix 
            selectedDept={selectedDept} 
            setSelectedDept={setSelectedDept}
            categories={categories}
            departmentData={departmentData}
          />
        </div>
        {/* 右側：詳細情報（意味の解説 & 部署比較） */}
        <div className="">
          <QuadrantMatrixDetails 
            selectedDept={selectedDept}
            departmentData={departmentSummaryData}
          />
        </div>
      </div>

      {/* 詳細分析：ヒートマップ */}
      <h2 className="text-xl font-bold text-gray-900 ml-8 mt-6">
        最新サーベイスコア詳細
      </h2>
      <div className="p-6 w-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          {showHeatmap && (
            <EmployeeSatisfactionHeatmap 
              defaultCategories={defaultCategories}
              customCategories={customCategories}
              data={heatmapData}
            />
          )}
          <div className="flex justify-between">
            <div className="flex space-x-4 pt-4">
              <button className="bg-brand-teal hover:bg-brand-darkBlue text-white px-4 py-2 rounded transition duration-300">
                スコア一覧をダウンロード
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerIssue