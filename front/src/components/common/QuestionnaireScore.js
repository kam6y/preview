// front/src/components/common/QuestionnaireScore.js
import ScoreCard from '../common/ScoreCard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Gauge from '../common/Gauge'

const QuestionnaireScore = ({
  score,
  prevDiff,
  companyAvg,
  rating,
  ratingLabel,
  history,
  setSelectedYears,
  selectedYears,
}) => {
  const yearDataPoints = { 1: 3, 3: 7, 5: 11 }

  const filteredHistory =
    history.length >= yearDataPoints[selectedYears]
      ? history.slice(-yearDataPoints[selectedYears])
      : history

  const scores = filteredHistory.map((item) => item.score)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)

  const margin = (maxScore - minScore) * 0.1
  const yAxisMin = Math.max(0, Math.floor((minScore - margin) / 10) * 10)
  const yAxisMax = Math.min(100, Math.ceil((maxScore + margin) / 10) * 10)

  return (
    <div className="flex justify-center space-x-6 w-[97%] mx-auto ">
      {/* スコア */}
      <div className="w-1/4">
        {/* タイトル */}
        <p className="text-lg font-bold mb-2 text-black text-center">スコア</p>

        {/* スコアカード */}
        <ScoreCard className="flex flex-col justify-center items-center h-64 p-6">
          {/* ゲージとスコア */}
          <div className="relative w-40 h-20 flex justify-center items-center">
            <Gauge value={score} max={100} />
            <p className="absolute text-5xl font-bold text-black mt-10">
              {score}
            </p>
          </div>

          {/* 仕切り線 */}
          <div className="border-t border-gray-300 w-full my-4"></div>

          {/* 前回比・全社平均 */}
          <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
            <p>
              前回比{' '}
              <span
                className={`font-bold ${prevDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {prevDiff}
              </span>
            </p>
            <p>全社平均 {companyAvg}</p>
          </div>
        </ScoreCard>
      </div>

      {/* レーティング */}
      <div className="w-1/4">
        {/* タイトル */}
        <p className="text-lg font-bold mb-2 text-black text-center">
          レーティング
        </p>

        {/* レーティングカード */}
        <ScoreCard className="flex flex-col justify-center items-center h-64 p-6">
          {/* レーティング数値 */}
          <p className="text-7xl font-bold text-black">{rating}</p>

          {/* レーティングラベル */}
          <p className="text-3xl text-orange-500 font-bold mt-4">
            {ratingLabel}
          </p>
        </ScoreCard>
      </div>

      {/* スコア遷移 */}
      <div className="w-3/4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-bold text-black">スコア遷移</p>
          {/* 期間切り替えボタン */}
          <div className="flex space-x-2">
            {[1, 3, 5].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYears(year)}
                className={`px-4 py-1 rounded text-white hover:bg-brand-orange ${
                  selectedYears === year
                    ? 'text-white bg-brand-darkBlue'
                    : 'bg-brand-cyan text-black'
                }`}
              >
                {year}年
              </button>
            ))}
          </div>
        </div>
        <ScoreCard className="p-4 h-64 flex flex-col justify-center items-center">
          {/* スコア遷移グラフ */}
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={filteredHistory}>
              <XAxis
                dataKey="date"
                allowDuplicatedCategory={false}
                interval={0}
                textAnchor="end"
                tickFormatter={(tick) => tick.slice(0, 7)}
              />
              <YAxis
                domain={[yAxisMin, yAxisMax]}
                ticks={Array.from(
                  { length: (yAxisMax - yAxisMin) / 5 + 1 },
                  (_, i) => yAxisMin + i * 5
                )}
              />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#FF7F50" />
            </LineChart>
          </ResponsiveContainer>
        </ScoreCard>
      </div>
    </div>
  )
}

export default QuestionnaireScore
