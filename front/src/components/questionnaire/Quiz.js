import { useState, useEffect, useRef } from 'react'
import ProgressBar from '../common/ProgressBar'
import Intro from './Intro'
import UserTypeSelection from './UserTypeSelection'
import UserInfoForm from './UserInfoForm'
import NextButton from '../common/NextButton'
import ExpectedQuestion from './ExpectedQuestion'
import RealQuestion from './RealQuestion'

const Quiz = ({ step, setStep, surveytype, tenantId, instanceId }) => {
  const [userType, setUserType] = useState(null)
  const [userInfo, setUserInfo] = useState({
    departmentLevel1: '',
    departmentLevel2: '',
    departmentLevel3: '',
    email: '',
  })

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const expectedRefs = useRef([])
  const satisfactionRefs = useRef([])
  const satisfactionTopRef = useRef(null)

  useEffect(() => {
    // tenantId, instanceId が取得できるまで待つ
    if (!tenantId || !instanceId) return

    const fetchQuestions = async () => {
      try {
        let res;
        if (surveytype === "1") {
          res = await fetch(
              `http://localhost/api/engagement-survey-questions/${tenantId}/${instanceId}`
          );
        } else {
          res = await fetch(
              `http://localhost/api/pulse-survey-questions/${tenantId}/${instanceId}`
          );
        }

        if (!res.ok) {
          throw new Error(`HTTPエラー: ${res.status}`);
        }

        const data = await res.json(); // 👈 res が undefined じゃなくなる
        setQuestions(data.questions);
        setAnswers(
            data.questions.map(() => ({
              expectation: null,
              satisfaction: null,
            }))
        );
      } catch (error) {
        console.error("データ取得失敗:", error);
      }
    }

    fetchQuestions()
  }, [tenantId, instanceId])

  // 期待度の質問への回答がすべて完了しているか確認する関数
  const isExpectationComplete = () => {
    if (questions.length === 0) return false
    return answers.every((answer) => answer.expectation !== null)
  }

  // 満足度の質問への回答がすべて完了しているか確認する関数
  const isSatisfactionComplete = () => {
    if (questions.length === 0) return false
    return answers.every((answer) => answer.satisfaction !== null)
  }

  // ステップを進める関数（バリデーション付き）
  const goToNextStep = (currentStep, nextStep) => {
    // 期待度ステップから満足度ステップへ進む場合
    if (currentStep === 3 && nextStep === 4) {
      if (isExpectationComplete()) {
        setStep(nextStep)
      } else {
        alert('すべての期待度の質問に回答してください。')
      }
    }
    // 満足度ステップから送信ステップへ進む場合
    else if (currentStep === 4 && nextStep === 5) {
      if (isSatisfactionComplete()) {
        setStep(nextStep)
      } else {
        alert('すべての満足度の質問に回答してください。')
      }
    }
    // その他のステップ移動（バリデーションなし）
    else {
      setStep(nextStep)
    }
  }

  const handleExpectationChange = (questionIndex, value) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = {
      ...newAnswers[questionIndex],
      expectation: value,
    }
    setAnswers(newAnswers)
    const nextIndex = questionIndex + 1
    if (nextIndex < questions.length) {
      const targetEl = expectedRefs.current[nextIndex]
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }

  const handleSatisfactionChange = (questionIndex, value) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = {
      ...newAnswers[questionIndex],
      satisfaction: value,
    }
    setAnswers(newAnswers)
    const nextIndex = questionIndex + 1
    if (nextIndex < questions.length) {
      const targetEl = satisfactionRefs.current[nextIndex]
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }

  const handleSubmit = () => {
    console.log('ユーザー情報:', userInfo)
    console.log('回答:', answers)
    alert('ご回答ありがとうございました！')
    // 送信後のアクションを追加（例：完了画面へ移動）
    setStep(6) // 例として完了画面を追加
  }

  let progress = 0
  if (answers.length > 0) {
    if (step === 3) {
      // step 3の場合は期待度の回答率を計算
      progress = Math.round(
          (answers.filter((a) => a.expectation !== null).length /
              questions.length) *
          100
      )
    } else if (step === 4) {
      // step 4の場合は満足度の回答率を計算
      progress = Math.round(
          (answers.filter((a) => a.satisfaction !== null).length /
              questions.length) *
          100
      )
    }
  }

  return (
      <div className="min-h-[calc(100vh-48px)] flex flex-col">
        {(step === 3 || step === 4) && (
            <div className="sticky top-12 z-50 bg-white shadow-md p-1 flex justify-center items-center w-full">
              <div className="text-base font-semibold text-gray-900 whitespace-nowrap mr-3">
                {step === 3 ? '期待度' : step === 4 ? '満足度' : ''}
              </div>
              <div className="flex-grow max-w-2xl">
                <ProgressBar progress={progress} />
              </div>
              <div className="text-base font-semibold text-gray-900 whitespace-nowrap ml-3">
                {progress}% 完了
              </div>
            </div>
        )}
        <div
            className={`max-w-4xl mx-auto rounded-md ${
                step === 3 || step === 4 ? 'mt-5 pt-4 pb-10 px-6' : 'mt-20 p-6'
            }`}
        >
          {step === 0 && <Intro onNext={() => setStep(1)} />}
          {step === 1 && (
              <UserTypeSelection onSelect={setUserType} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
              <UserInfoForm
                  userType={userType}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  onNext={() => setStep(3)}
              />
          )}
          {step === 3 && (
              <>
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                  STEP3 組織に対する期待度を5段階で教えてください！
                </h2>
                {questions.map((q, i) => (
                    <ExpectedQuestion
                        key={q.id}
                        questionIndex={i}
                        question={q}
                        currentValue={answers[i]?.expectation}
                        onChange={handleExpectationChange}
                        forwardRef={(el) => (expectedRefs.current[i] = el)}
                    />
                ))}
                <div className="flex justify-between mt-8">
                  <NextButton onClick={() => setStep(2)}>戻る</NextButton>
                  <NextButton onClick={() => goToNextStep(3, 4)}>次へ</NextButton>
                </div>
              </>
          )}
          {step === 4 && (
              <>
                <h2
                    ref={satisfactionTopRef}
                    className="text-3xl font-bold mb-8 text-center text-gray-900"
                >
                  STEP4 組織に対する実際の満足度を5段階で教えてください
                </h2>
                {questions.map((q, i) => (
                    <RealQuestion
                        key={q.id}
                        questionIndex={i}
                        question={q}
                        currentValue={answers[i]?.satisfaction}
                        onChange={handleSatisfactionChange}
                        ref={(el) => (satisfactionRefs.current[i] = el)}
                    />
                ))}
                <div className="flex justify-between mt-8">
                  <NextButton onClick={() => setStep(3)}>戻る</NextButton>
                  <NextButton onClick={() => goToNextStep(4, 5)}>次へ</NextButton>
                </div>
              </>
          )}
          {step === 5 && (
              <div className="p-6">
                {/* タイトルをカードの外に配置 */}
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-brand-darkBlue">
                  STEP5 回答内容の送信
                </h2>
                <div className="w-32 h-1 bg-brand-teal mx-auto mb-8 rounded-full opacity-60"></div>

                {/* カードを横長に */}
                <div className="bg-white shadow-lg border border-brand-lightGray rounded-3xl p-6 md:p-8 max-w-5xl mx-auto">
                  <h3 className="text-xl font-semibold mb-6 text-brand-darkBlue text-center">
                    回答内容の確認
                  </h3>

                  <div className="gap-6 mb-8 text-black">

                    <div className=" gap-6 mb-8">
                      {/* 情報 */}
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <p className="text-lg mb-3 font-medium ">回答者情報</p>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-700 mb-2">
                            部署: {userInfo.departmentLevel1}{' '}
                            {userInfo.departmentLevel2} {userInfo.departmentLevel3}
                          </p>
                          <p className="text-gray-700">
                            メールアドレス: {userInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mb-8 text-xl text-center text-gray-700">
                    回答内容を送信してよろしいですか？
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-xl mx-auto">
                    <button
                        onClick={() => setStep(4)}
                        className="w-full py-3 bg-brand-darkBlue text-white font-semibold rounded-full hover:bg-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-darkBlue transition duration-200"
                    >
                      戻る
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-3 bg-brand-orange text-white font-semibold rounded-full hover:bg-brand-coral focus:outline-none focus:ring-2 focus:ring-brand-orange transition duration-200 flex items-center justify-center"
                    >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                      </svg>
                      送信する
                    </button>
                  </div>
                </div>
              </div>
          )}
          {step === 6 && (
              <div className="p-8 rounded-3xl bg-white shadow-lg border border-brand-lightGray text-center">
                <div className="mb-8 flex justify-center">
                  <div className="bg-green-100 p-4 rounded-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-brand-teal"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-brand-darkBlue">
                  回答完了
                </h2>
                <div className="w-32 h-1 bg-brand-teal mx-auto mb-8 rounded-full opacity-60"></div>

                <p className="mb-8 text-xl text-gray-700">
                  ご回答いただき、誠にありがとうございました！
                </p>
                <p className="mb-10 text-gray-600 max-w-2xl mx-auto">
                  いただいた貴重なご意見は、今後のサービス改善に活用させていただきます。
                  引き続き、よろしくお願いいたします。
                </p>

                <div className="max-w-sm mx-auto">
                  <button
                      onClick={() => setStep(0)}
                      className="w-full py-3 bg-brand-darkBlue text-white font-semibold rounded-full hover:bg-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-darkBlue transition duration-200"
                  >
                    トップページへ戻る
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}

export default Quiz