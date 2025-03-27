// front/src/components/common/PulseSurveyChart.jsx
import React, { useState } from 'react'
import CategoryScoreTable from '@/components/common/CategoryScoreTable'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const PulseSurveyChart = ({
  selectedOrganization,
  pulseSurveyData,
  managerScoreData,
  questionData,
  allImprovementItems,
}) => {
  // 表示する設問（最大3つまで）
  const [selectedQuestions, setSelectedQuestions] = useState([1, 2, 3])
  // チャートモード（実感値、期待値、またはGAP）
  const [chartMode, setChartMode] = useState('実感値')
  // 表示モード（パルスサーベイまたは管理者スコア）
  const [scoreMode, setScoreMode] = useState('pulse')
  // 比較期間の状態
  const [comparisonPeriod, setComparisonPeriod] = useState('前回')
  // スコア一覧セクションの表示/非表示状態
  const [showScoreSection, setShowScoreSection] = useState(true)

  // パルスサーベイで聞く設問リスト（ID 1-8）
  const surveyQuestions = allImprovementItems
    .slice(0, 8)
    .map((item) => ({ ...item, inSurvey: true }))

  // パルスサーベイで聞かない設問リスト（ID 9-16）
  const nonSurveyQuestions = allImprovementItems
    .slice(8)
    .map((item) => ({ ...item, inSurvey: false }))

  // すべての設問をマージ
  const allQuestions = allImprovementItems.map((item) => {
    // id 1-8はパルスサーベイ対象、9-16は対象外
    return { ...item, inSurvey: item.id <= 8 }
  })

  // 設問選択の処理
  const toggleQuestionSelection = (questionId) => {
    // パルスサーベイで聞かない項目は選択できないようにする
    const question = allQuestions.find((q) => q.id === questionId)
    if (!question || !question.inSurvey) return

    if (selectedQuestions.includes(questionId)) {
      // すでに選択されている場合は削除
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId))
    } else {
      // 3つまで選択可能
      if (selectedQuestions.length < 3) {
        setSelectedQuestions([...selectedQuestions, questionId])
      }
    }
  }

  // 選択された設問のカラーマップ
  const questionColors = {
    1: { color: '#178394', shape: 'circle' },
    2: { color: '#00A3B3', shape: 'triangle' },
    3: { color: '#004259', shape: 'square' },
    4: { color: '#F29759', shape: 'circle' },
    5: { color: '#FC7F7A', shape: 'triangle' },
    6: { color: '#178394', shape: 'diamond' },
    7: { color: '#00A3B3', shape: 'circle' },
    8: { color: '#004259', shape: 'triangle' },
    9: { color: '#F29759', shape: 'square' },
    10: { color: '#FC7F7A', shape: 'circle' },
    11: { color: '#178394', shape: 'triangle' },
    12: { color: '#00A3B3', shape: 'square' },
    13: { color: '#004259', shape: 'circle' },
    14: { color: '#F29759', shape: 'triangle' },
    15: { color: '#FC7F7A', shape: 'square' },
    16: { color: '#178394', shape: 'diamond' },
  }

  // 形状を取得
  const getShapeForQuestion = (questionId) => {
    const shapes = {
      circle: 'circle',
      triangle: 'triangle',
      square: 'rect',
      diamond: 'diamond',
    }

    return shapes[questionColors[questionId]?.shape] || 'circle'
  }

  // データキーの取得（チャートモードに応じて）
  const getDataKey = (questionId) => {
    switch (chartMode) {
      case '実感値':
        return `satisfaction${questionId}`
      case '期待値':
        return `expectation${questionId}`
      case 'GAP':
        return `gap${questionId}`
      default:
        return `satisfaction${questionId}`
    }
  }

  return (
    <div className="mt-6 px-6 pb-6">
      {/* タイトルをカード外に表示 */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-brand-darkBlue mr-4 mb-2">
          パルスサーベイ結果推移
        </h2>
        {/* スコア一覧表示切替ボタン */}
        <button
          onClick={() => setShowScoreSection(!showScoreSection)}
          className="bg-brand-darkBlue mb-2 text-white px-4 py-2 rounded-md hover:bg-brand-teal transition-colors"
        >
          {showScoreSection ? 'スコア一覧を非表示' : 'スコア一覧を表示'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-end items-center mb-3">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-md ${chartMode === '実感値' ? 'bg-brand-teal text-white' : 'bg-brand-lightGray text-gray-700'}`}
              onClick={() => setChartMode('実感値')}
            >
              実感値
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${chartMode === '期待値' ? 'bg-brand-teal text-white' : 'bg-brand-lightGray text-gray-700'}`}
              onClick={() => setChartMode('期待値')}
            >
              期待値
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${chartMode === 'GAP' ? 'bg-brand-teal text-white' : 'bg-brand-lightGray text-gray-700'}`}
              onClick={() => setChartMode('GAP')}
            >
              GAP
            </button>
          </div>
        </div>

        {/* グラフの高さを小さくする */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={questionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="id"
                label={{
                  value: '(回目)',
                  position: 'insideBottomRight',
                  offset: -5,
                }}
              />
              <YAxis
                domain={chartMode === 'GAP' ? [-4, 4] : [1, 5]}
                label={{
                  value: chartMode === 'GAP' ? '目標値 0' : '評価 (1-5)',
                  position: 'insideLeft',
                  angle: -90,
                  dy: 30,
                }}
              />
              <Tooltip formatter={(value) => parseFloat(value).toFixed(1)} />
              <Legend />
              {chartMode === 'GAP' && (
                <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
              )}

              {/* 選択された設問のみ表示 */}
              {selectedQuestions.map((qId) => (
                <Line
                  key={qId}
                  type="monotone"
                  dataKey={getDataKey(qId)}
                  name={`設問${qId}`}
                  stroke={questionColors[qId]?.color}
                  strokeWidth={2}
                  dot={{
                    r: 5,
                    fill: questionColors[qId]?.color,
                    symbol: getShapeForQuestion(qId),
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 設問選択エリア */}
        <div className="mt-2 max-h-48 overflow-y-auto pr-1">
          {/* パルスサーベイで聞く設問 */}
          <div className="mb-4">
            <h3 className="text-base font-bold mb-2 text-gray-800">
              パルスサーベイ対象項目
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {surveyQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`flex items-center p-1 rounded cursor-pointer text-xs ${
                    selectedQuestions.includes(question.id)
                      ? 'bg-brand-lightGray text-gray-800'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => toggleQuestionSelection(question.id)}
                >
                  <div
                    className="w-3 h-3 min-w-3 mr-1 rounded-sm"
                    style={{
                      backgroundColor: selectedQuestions.includes(question.id)
                        ? questionColors[question.id]?.color
                        : '#ccc',
                    }}
                  ></div>
                  <span className="truncate">{question.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* パルスサーベイで聞かない設問 */}
          <div>
            <h3 className="text-base font-bold mb-2 text-gray-800">
              パルスサーベイ対象外項目
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {nonSurveyQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-center p-1 rounded text-xs text-gray-500"
                >
                  <div className="w-3 h-3 min-w-3 mr-1 rounded-sm bg-gray-300"></div>
                  <span className="truncate">{question.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-1 text-xs text-gray-600">
          ※ グラフには最大3つまでの設問を表示できます
        </div>
        {/* スコア一覧セクション - トグルボタンでパルスサーベイと管理者スコアを切り替え */}
        {showScoreSection && (
          <div className="mb-6">
            {/* トグルボタン */}
            <div className="flex justify-start items-center ml-4 mt-10 ">
              <div className="flex space-x-2 ">
                <button
                  className={`px-4 py-2 text-sm rounded-md ${scoreMode === 'pulse' ? 'bg-brand-cyan text-white' : 'bg-brand-lightGray text-gray-700'}`}
                  onClick={() => setScoreMode('pulse')}
                >
                  パルスサーベイ
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-md ${scoreMode === 'manager' ? 'bg-brand-cyan text-white' : 'bg-brand-lightGray text-gray-700'}`}
                  onClick={() => setScoreMode('manager')}
                >
                  管理者スコア
                </button>
              </div>
            </div>

            {/* 条件付きレンダリングでデータを切り替え */}
            <CategoryScoreTable
              mergedData={
                scoreMode === 'pulse' ? pulseSurveyData : managerScoreData
              }
              comparisonPeriod={comparisonPeriod}
              setComparisonPeriod={setComparisonPeriod}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PulseSurveyChart
