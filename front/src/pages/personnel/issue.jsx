import { useState, useEffect } from 'react'
import PersonnelHeader from '../../components/personnel/PersonnelHeader'
import AnalysisImprovementHeader from '@/components/common/AnalysisImprovementHeader'
import QuestionnaireScore from '../../components/common/QuestionnaireScore'
import CategoryScoreSection from '../../components/common/CategoryScoreSection'
import QuadrantMatrix from '../../components/manager/4QuadrantMatrix'
import QuadrantMatrixDetails from '../../components/manager/QuadrantMatrixDetails'
import ChallengeList from '../../components/manager/ChallengeList'
import AnswerRateTransition from '../../components/common/AnswerRateTransition'

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

const ManagerIssue = () => {
  const [selectedYears, setSelectedYears] = useState(1)
  const [fullHistory, setFullHistory] = useState(null)
  const [latestScore, setLatestScore] = useState(null)
  const [comparisonPeriod, setComparisonPeriod] = useState('前回')
  const [selectedDept, setSelectedDept] = useState('営業部') // 部署の選択状態を管理
  
  // 回答率関連のデータ
  const currentRate = 55
  const rateHistory = [
    { date: '2024/02', rate: 30 },
    { date: '2024/08', rate: 25 },
    { date: '2025/02', rate: 40 },
    { date: '2025/08', rate: null },
  ]

  // 16項目のカテゴリーデータ
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
  ];
  
  // 4象限マトリックス用の部門データ（QuadrantMatrixコンポーネントから移植）
  // 営業部のデータ - 全16項目に対応
  const departmentData = {
    営業部: categories.map((item) => ({
      id: item.id,
      category: item.category,
      x: Math.random() * 4 + 1, // 1.0 - 5.0 のランダム値
      y: Math.random() * 4 + 1, // 1.0 - 5.0 のランダム値
    })),
  };
  
  // 部門概要データ
  const departmentSummaryData = {
    '営業部': {
      strengths: ['顧客関係', '職場環境'],
      weaknesses: ['評価制度', '社内コミュニケーション'],
      companyAvg: 3.5,
      departmentAvg: 3.6
    }
  }

  // 16項目の質問データ
  const questionsData = [
    { id: 1, category: '顧客基盤の安定性', question: '企業が長期間にわたって安定した顧客関係を築き、維持している状態。' },
    { id: 2, category: '理念戦略への納得感', question: '従業員が企業のビジョンや戦略に共感し、それに対する理解と信頼を持っていること。' },
    { id: 3, category: '社会的貢献', question: '企業が社会的責任を果たし、地域社会や社会全体へ積極的に貢献している行為。' },
    { id: 4, category: '責任と顧客・社会への貢献', question: '企業が顧客への約束を守り、社会に対しても積極的に貢献している姿勢。' },
    { id: 5, category: '連帯感と相互尊重', question: '従業員間での団結力と互いの価値観を尊重する文化があること。' },
    { id: 6, category: '魅力的な上司', question: '職場において、尊敬できる上司や魅力的な同僚がいること。' },
    { id: 7, category: '勤務地や会社設備の魅力', question: '勤務地の立地や会社の設備が充実していて働きやすい環境が整っていること。' },
    { id: 8, category: '評価・給与と柔軟な働き方', question: '公正な評価と適正な給与、柔軟な勤務体制が提供されていること。' },
    { id: 9, category: '顧客ニーズや事業戦略の伝達', question: '顧客の要望や企業の事業戦略が従業員に明確に伝えられていること。' },
    { id: 10, category: '上司や会社からの理解', question: '従業員の意見や状況に対して、上司や会社が理解と支持を示していること。' },
    { id: 11, category: '公平な評価', question: '従業員の業績や行動が公正な基準によって評価されていること。' },
    { id: 12, category: '上司からの適切な教育・支援', question: '上司が従業員の成長を支援し、必要な知識やスキルの提供を行っていること。' },
    { id: 13, category: '顧客の期待を上回る提案', question: '従業員が顧客の期待を超える提案やサービスを提供していること。' },
    { id: 14, category: '具体的な目標の共有', question: '会社の目標が明確であり、それが従業員と共有されていること。' },
    { id: 15, category: '未来に向けた活動', question: '企業が将来の成功に向けて戦略的な活動を行っていること。' },
    { id: 16, category: 'ナレッジの標準化', question: '企業が持つ知識や情報が整理され、効率的に活用されていること。' }
  ];

  // 16項目のスコアデータ
  const scoreData = [
    {
      categoryId: 1,
      expectation: 3.7,
      expectationDiff: 0.3,
      expectationYoyDiff: 0.5,
      satisfaction: 3.7,
      satisfactionDiff: 0.6,
      satisfactionYoyDiff: 0.4
    },
    {
      categoryId: 2,
      expectation: 4.0,
      expectationDiff: 0.1,
      expectationYoyDiff: 0.3,
      satisfaction: 3.3,
      satisfactionDiff: 0.2,
      satisfactionYoyDiff: 0.1
    },
    {
      categoryId: 3,
      expectation: 3.5,
      expectationDiff: 0.2,
      expectationYoyDiff: 0.4,
      satisfaction: 3.2,
      satisfactionDiff: 0.3,
      satisfactionYoyDiff: 0.2
    },
    {
      categoryId: 4,
      expectation: 3.8,
      expectationDiff: -0.1,
      expectationYoyDiff: 0.3,
      satisfaction: 3.5,
      satisfactionDiff: -0.2,
      satisfactionYoyDiff: 0.2
    },
    {
      categoryId: 5,
      expectation: 3.6,
      expectationDiff: 0.2,
      expectationYoyDiff: 0.4,
      satisfaction: 3.4,
      satisfactionDiff: 0.3,
      satisfactionYoyDiff: 0.3
    },
    {
      categoryId: 6,
      expectation: 3.9,
      expectationDiff: 0.3,
      expectationYoyDiff: 0.2,
      satisfaction: 3.6,
      satisfactionDiff: 0.2,
      satisfactionYoyDiff: 0.3
    },
    {
      categoryId: 7,
      expectation: 3.5,
      expectationDiff: 0.1,
      expectationYoyDiff: 0.3,
      satisfaction: 3.3,
      satisfactionDiff: 0.4,
      satisfactionYoyDiff: 0.5
    },
    {
      categoryId: 8,
      expectation: 4.1,
      expectationDiff: 0.2,
      expectationYoyDiff: 0.3,
      satisfaction: 3.2,
      satisfactionDiff: 0.3,
      satisfactionYoyDiff: 0.4
    },
    {
      categoryId: 9,
      expectation: 3.8,
      expectationDiff: 0.4,
      expectationYoyDiff: 0.3,
      satisfaction: 3.4,
      satisfactionDiff: 0.3,
      satisfactionYoyDiff: 0.5
    },
    {
      categoryId: 10,
      expectation: 3.7,
      expectationDiff: 0.2,
      expectationYoyDiff: 0.3,
      satisfaction: 3.2,
      satisfactionDiff: 0.1,
      satisfactionYoyDiff: 0.2
    },
    {
      categoryId: 11,
      expectation: 4.0,
      expectationDiff: 0.3,
      expectationYoyDiff: 0.4,
      satisfaction: 3.4,
      satisfactionDiff: 0.2,
      satisfactionYoyDiff: 0.3
    },
    {
      categoryId: 12,
      expectation: 3.9,
      expectationDiff: 0.2,
      expectationYoyDiff: 0.3,
      satisfaction: 3.5,
      satisfactionDiff: 0.3,
      satisfactionYoyDiff: 0.4
    },
    {
      categoryId: 13,
      expectation: 3.8,
      expectationDiff: 0.1,
      expectationYoyDiff: 0.2,
      satisfaction: 3.3,
      satisfactionDiff: 0.2,
      satisfactionYoyDiff: 0.1
    },
    {
      categoryId: 14,
      expectation: 3.7,
      expectationDiff: 0.3,
      expectationYoyDiff: 0.4,
      satisfaction: 3.4,
      satisfactionDiff: 0.4,
      satisfactionYoyDiff: 0.3
    },
    {
      categoryId: 15,
      expectation: 3.6,
      expectationDiff: 0.2,
      expectationYoyDiff: 0.3,
      satisfaction: 3.1,
      satisfactionDiff: 0.1,
      satisfactionYoyDiff: 0.2
    },
    {
      categoryId: 16,
      expectation: 3.5,
      expectationDiff: 0.1,
      expectationYoyDiff: 0.3,
      satisfaction: 3.2,
      satisfactionDiff: 0.2,
      satisfactionYoyDiff: 0.3
    }
  ];

  // 課題データ - 16項目に対応
  const challengeData = [
    { id: 101, category: '顧客基盤の安定性', challenge: '顧客離れが増加している', measureCount: 3 },
    { id: 201, category: '理念戦略への納得感', challenge: '会社のビジョンが社員に浸透していない', measureCount: 2 },
    { id: 301, category: '社会的貢献', challenge: 'SDGsへの取り組みが不十分', measureCount: 2 },
    { id: 401, category: '責任と顧客・社会への貢献', challenge: '顧客の声が製品に反映されていない', measureCount: 1 },
    { id: 501, category: '連帯感と相互尊重', challenge: '部門間の連携が取れていない', measureCount: 3 },
    { id: 601, category: '魅力的な上司', challenge: 'リーダーシップが発揮されていない', measureCount: 2 },
    { id: 701, category: '勤務地や会社設備の魅力', challenge: 'リモートワーク環境が整っていない', measureCount: 1 },
    { id: 801, category: '評価・給与と柔軟な働き方', challenge: '評価基準が不明確', measureCount: 2 },
    { id: 901, category: '顧客ニーズや事業戦略の伝達', challenge: '顧客ニーズの把握が不十分', measureCount: 1 },
    { id: 1001, category: '上司や会社からの理解', challenge: '上司が部下の状況を理解していない', measureCount: 2 },
    { id: 1101, category: '公平な評価', challenge: '評価の透明性が低い', measureCount: 1 },
    { id: 1201, category: '上司からの適切な教育・支援', challenge: 'スキル向上のための機会が少ない', measureCount: 3 },
    { id: 1301, category: '顧客の期待を上回る提案', challenge: '提案力が弱い', measureCount: 2 },
    { id: 1401, category: '具体的な目標の共有', challenge: '部門目標が不明確', measureCount: 1 },
    { id: 1501, category: '未来に向けた活動', challenge: '中長期計画が不在', measureCount: 2 },
    { id: 1601, category: 'ナレッジの標準化', challenge: '知識共有の仕組みがない', measureCount: 1 }
  ];

  // 課題カテゴリー選択肢データ - 16項目に対応
  const challengeCategories = categories.map(cat => ({ id: cat.id.toString(), name: cat.category }));

  // スコアデータと質問データを統合
  const mergedData = scoreData.map((score) => {
    const questionData = questionsData.find(
      (q) => q.id === score.categoryId
    ) || {
      id: score.categoryId,
      category: `カテゴリー ${score.categoryId}`,
      question: '質問内容が登録されていません。'
    }

    return {
      ...score,
      category: questionData.category,
      question: questionData.question
    }
  });

  useEffect(() => {
    const generatedData = generateHistoryData('2025-02-07', 5)
    setFullHistory(generatedData)
    const filteredHistory = generatedData.slice(-(selectedYears * 2 + 1))
    setLatestScore(
      filteredHistory.length > 0
        ? filteredHistory[filteredHistory.length - 1].score
        : 0
    )
  }, [selectedYears])

  if (!fullHistory || latestScore === null) return null

  const data = {
    score: latestScore,
    prevDiff: '+0.5',
    companyAvg: '58.9 (-3.6)',
    rating: 55,
    ratingLabel: 'BB',
    history: fullHistory,
    setSelectedYears,
    selectedYears
  }

  return (
    <div className="bg-brand-lightGray min-h-screen flex flex-col">
      {/* ヘッダー */}
      <PersonnelHeader showNav={true} showTenantName={true} />
      <AnalysisImprovementHeader 
        analysisPath="/personnel/dashboard" 
        improvementPath="/personnel/measures" 
      />
      <h2 className="text-xl font-bold mb-4 pl-6 pt-2 text-gray-900">
        営業部
      </h2>
      <QuestionnaireScore {...data} />
      
      {/* 解答率推移コンポーネント */}
      <AnswerRateTransition
        currentRate={currentRate}
        rateHistory={rateHistory}
      />

      {/* 4象限マトリクス & 詳細情報を横並びに配置 */}
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

      {/* 詳細分析: スコア一覧(管理職) */}
      <h2 className="text-black mx-4 text-xl font-bold mt-4">管理職一覧</h2>
      <CategoryScoreSection
        mergedData={mergedData}
        comparisonPeriod={comparisonPeriod}
        setComparisonPeriod={setComparisonPeriod}
      />

      {/* 詳細分析: スコア一覧(従業員) */}
      <h2 className="text-black mx-4 text-xl font-bold mt-4">従業員結果一覧</h2>
      <CategoryScoreSection
        mergedData={mergedData}
        comparisonPeriod={comparisonPeriod}
        setComparisonPeriod={setComparisonPeriod}
      />

      {/* 課題一覧・新規登録 */}
      <ChallengeList
        challenges={challengeData}
        categories={challengeCategories}
      />
    </div>
  )
}

export default ManagerIssue