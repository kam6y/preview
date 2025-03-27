// front/src/pages/manager/measures_register.jsx
import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import ManagerHeader from '../../components/manager/ManagerHeader';
import StepBar from '../../components/manager/StepBar';
import Step1Content from '../../components/manager/measures/Step1Content';
import Step2Content from '../../components/manager/measures/Step2Content';
import Step3Content from '../../components/manager/measures/Step3Content';
import AssigneeModal from '../../components/manager/measures/AssigneeModal';
import AIChatBox from '../../components/manager/measures/AIChatBox';

// dummyDataの内容をコンポーネント内に移動
const categories = [
  '顧客基盤の安定性',
  '理念戦略への納得感',
  '社会的貢献',
  '責任と顧客・社会への貢献',
  '連帯感と相互尊重',
  '魅力的な上司',
  '勤務地や会社設備の魅力',
  '評価・給与と柔軟な働き方',
  '顧客ニーズや事業戦略の伝達',
  '上司や会社からの理解',
  '公平な評価',
  '上司からの適切な教育・支援',
  '顧客の期待を上回る提案',
  '具体的な目標の共有',
  '未来に向けた活動',
  'ナレッジの標準化',
];

const categoryIssues = {
  顧客基盤の安定性: [
    '顧客離れ',
    '新規顧客獲得の難しさ',
    'リピート率低下',
    '顧客満足度低下',
    '競合他社の台頭',
  ],
  // ... 他のカテゴリーの課題も同様に移動
};

const aiSuggestions = [
  {
    shisaku: '定期的な意見交換の場を設ける',
    actionPlan: '月1回のワークショップを開催',
    actionPlanDetail: 'チーム全員が参加できる日時を設定し、意見を出し合える場を作ります。オンラインとオフラインの両方の参加方法を用意し、記録を残して共有します。',
  },
  // ... 他のAI施策サジェストも同様に移動
];

const defaultAssigneeList = [
  '田中',
  '鈴木',
  '山田',
  '佐藤',
];

export default function MeasuresRegisterPage() {
  // クライアントサイドレンダリング検出用
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // -------------------
  // 状態管理
  // -------------------
  const [slideDirection, setSlideDirection] = useState('next');
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  // 前のステップで選択していた施策インデックスを保存
  const [lastViewedMeasureIndex, setLastViewedMeasureIndex] = useState(0);
  // 新しい状態: Step2への初回訪問フラグ
  const [isFirstVisitToStep2, setIsFirstVisitToStep2] = useState(true);
  // AI生成の施策を管理
  const [aiGeneratedMeasures, setAiGeneratedMeasures] = useState({});
  // AIによる目標値推奨を管理
  const [aiRecommendedGoals, setAiRecommendedGoals] = useState(false);

  // -------------------
  // ステップ管理
  // -------------------
  const [currentStep, setCurrentStep] = useState(1);
  const [showContent, setShowContent] = useState(true);
  const [pendingStep, setPendingStep] = useState(null);

  const steps = [
    { id: 1, label: 'Step 1' },
    { id: 2, label: 'Step 2' },
    { id: 3, label: 'Step 3' },
  ];

  // -------------------
  // 各ステップ用の状態
  // -------------------
  // Step1: 課題カテゴリー & 課題選択
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedKadai, setSelectedKadai] = useState([]);

  // Step2: 施策案 & アクションプラン統合（複数施策対応）
  // 複数の施策を管理するための配列
  const [measures, setMeasures] = useState([
    {
      shisaku: '', // 施策案
      actionPlan: '', // アクションプラン
      dueDate: '', // 期限
      assignee: '', // 担当者
      actionPlanDetail: '', // アクションプラン詳細
    },
  ]);
  const [currentMeasureIndex, setCurrentMeasureIndex] = useState(0);
  const [assigneeList, setAssigneeList] = useState(defaultAssigneeList);
  const [newAssignee, setNewAssignee] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step3: 目標設定
  const [currentSatisfaction] = useState(3.3);
  const [currentExpectation] = useState(3.8);
  const [currentGap] = useState(currentExpectation - currentSatisfaction);

  // ここではオフセットで目標値を設定
  const [satisfactionOffset, setSatisfactionOffset] = useState(0.0);
  const [gapOffset, setGapOffset] = useState(0.0);

  // 目標満足度は currentSatisfaction + satisfactionOffset
  const computedTargetSatisfaction = currentSatisfaction + satisfactionOffset;
  // 目標GAPは currentGap + gapOffset
  const computedTargetGap = currentGap + gapOffset;
  // 目標期待値は、目標満足度 + 目標GAP
  const computedTargetExpectation =
    computedTargetSatisfaction + computedTargetGap;

  // -------------------
  // バリデーション
  // -------------------
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return selectedCategory !== '' && selectedKadai.length > 0;
      case 2:
        // 現在表示中の施策が有効かを確認
        const currentMeasure = measures[currentMeasureIndex];
        return (
          currentMeasure.shisaku.trim() !== '' &&
          currentMeasure.actionPlan.trim() !== '' &&
          currentMeasure.dueDate !== '' &&
          currentMeasure.assignee !== '' &&
          currentMeasure.actionPlanDetail.trim() !== ''
        );
      case 3:
        return !isNaN(satisfactionOffset) && !isNaN(gapOffset);
      default:
        return false;
    }
  };

  // Step2からStep3に遷移する際にAIによる目標値設定を行う関数
  const generateAIRecommendedGoals = () => {
    // 施策の内容に基づいて目標値を計算するロジック
    // 実際のアプリケーションではここでAPIを呼び出すなどして値を取得する
    
    // 例として、シンプルなロジック（実際のプロダクトではより複雑なロジックになる）
    const currentMeasure = measures[currentMeasureIndex];
    let recommendedSatisfactionOffset = 0;
    let recommendedGapOffset = 0;
    
    // 施策内容に「定期的」というキーワードが含まれていれば満足度の向上が期待できる、など
    if (currentMeasure.shisaku.includes('定期的') || 
        currentMeasure.actionPlan.includes('定期的') ||
        currentMeasure.actionPlanDetail.includes('定期的')) {
      recommendedSatisfactionOffset = Math.min(1.2, 5 - currentSatisfaction);
    } else if (currentMeasure.shisaku.includes('改善') || 
               currentMeasure.actionPlan.includes('改善') ||
               currentMeasure.actionPlanDetail.includes('改善')) {
      recommendedSatisfactionOffset = Math.min(0.8, 5 - currentSatisfaction);
    } else {
      // デフォルト値
      recommendedSatisfactionOffset = Math.min(0.5, 5 - currentSatisfaction);
    }
    
    // GAPの改善（縮小）
    recommendedGapOffset = -Math.min(0.3, currentGap * 0.5);
    
    // 値をセット
    setSatisfactionOffset(parseFloat(recommendedSatisfactionOffset.toFixed(1)));
    setGapOffset(parseFloat(recommendedGapOffset.toFixed(1)));
    
    // AIによる推奨であることをマーク
    setAiRecommendedGoals(true);
  };

  // -------------------
  // ステップ遷移用関数
  // -------------------
  const handleNext = () => {
    if (currentStep < 3 && canGoNext()) {
      if (currentStep === 1) {
        // Step1からStep2に移動する際の処理
        // 初回のみフラグをtrueにしておく（すでにtrueなので特に処理不要）
      } else if (currentStep === 2) {
        // Step2からStep3に進む前に、現在の施策インデックスを保存
        setLastViewedMeasureIndex(currentMeasureIndex);
        
        // AIによる目標値推奨を実行
        generateAIRecommendedGoals();
      }
      setPendingStep(currentStep + 1);
      setShowContent(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      // Step2からStep1に戻る場合、初回フラグをリセットしない
      setPendingStep(currentStep - 1);
      setShowContent(false);
    }
  };

  const handleFinish = () => {
    if (currentStep === 3 && canGoNext()) {
      alert('入力が完了しました。コンソールをご確認ください。');
      console.log('=== Step1 ===', selectedCategory, selectedKadai);
      console.log('=== Step2 ===', measures[lastViewedMeasureIndex]);
      console.log(
        '=== Step3 ===',
        currentSatisfaction,
        currentExpectation,
        computedTargetSatisfaction,
        computedTargetGap,
        computedTargetExpectation
      );
    }
  };

  const handleExited = () => {
    if (pendingStep !== null) {
      // Step1からStep2に移動した時の処理
      if (currentStep === 1 && pendingStep === 2) {
        // Step2に入った時に初回訪問フラグをfalseにするのはしない
        // 代わりに、Step2のレンダリング後に一定時間後にフラグをfalseにする
        setTimeout(() => {
          setIsFirstVisitToStep2(false);
        }, 1200000); // 120秒後に吹き出しを消す
      }

      setCurrentStep(pendingStep);
      setPendingStep(null);
      setShowContent(true);
    }
  };

  // -------------------
  // 課題チェックボックスハンドラ
  // -------------------
  const handleKadaiChange = (kadai) => {
    if (selectedKadai.includes(kadai)) {
      setSelectedKadai(selectedKadai.filter((item) => item !== kadai));
    } else {
      setSelectedKadai([...selectedKadai, kadai]);
    }
  };

  // -------------------
  // 施策関連のハンドラ
  // -------------------
  // 入力データを更新するハンドラ
  const updateMeasure = (field, value) => {
    const updatedMeasures = [...measures];
    updatedMeasures[currentMeasureIndex][field] = value;
    setMeasures(updatedMeasures);
  };

  // 担当者追加ハンドラ
  const handleAddAssignee = () => {
    if (newAssignee.trim() === '') return;
    setAssigneeList([...assigneeList, newAssignee.trim()]);
    setNewAssignee('');
  };

  // 施策をスライドするためのハンドラ
  const handlePrevMeasure = () => {
    if (currentMeasureIndex > 0) {
      setSlideDirection('prev');
      setCurrentMeasureIndex(currentMeasureIndex - 1);
    }
  };

  const handleNextMeasure = () => {
    if (currentMeasureIndex < measures.length - 1) {
      setSlideDirection('next');
      setCurrentMeasureIndex(currentMeasureIndex + 1);
    }
  };

  // 新しい施策をAIに生成してもらうハンドラ
  const handleGenerateNewMeasure = () => {
    setIsLoading(true);

    // 実際にはここでAPIコールをして施策を生成する
    // 今回はデモ用にダミーの応答を遅延させて表示
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * aiSuggestions.length);
      const suggestion = aiSuggestions[randomIndex];

      const newMeasure = {
        shisaku: suggestion.shisaku,
        actionPlan: suggestion.actionPlan,
        dueDate: '',
        assignee: '',
        actionPlanDetail: suggestion.actionPlanDetail,
      };

      // 施策を追加
      const newIndex = measures.length;
      setMeasures([...measures, newMeasure]);

      // AIによって生成された施策としてマーク
      setAiGeneratedMeasures((prev) => ({
        ...prev,
        [newIndex]: true,
      }));

      setCurrentMeasureIndex(newIndex); // 新しく追加した施策にフォーカス
      setIsLoading(false);
      setSlideDirection('next');
    }, 1500);
  };

  // 現在の施策がAIによって生成されたかどうかを判定
  const isCurrentMeasureAIGenerated = () => {
    return aiGeneratedMeasures[currentMeasureIndex] === true;
  };

  return (
    <div className="pb-4 min-h-screen bg-brand-lightGray text-brand-darkBlue">
      <ManagerHeader showNav={false} />
      <div className="m-4">
        <StepBar currentStep={currentStep} steps={steps} />
      </div>
      <div
        id="main-content"
        className="max-w-4xl mx-auto mb-4 p-6 bg-white rounded shadow-md relative overflow-hidden transition-all"
      >
        <CSSTransition
          in={showContent}
          timeout={300}
          classNames="fade"
          unmountOnExit
          onExited={handleExited}
        >
          <div>
            {currentStep === 1 && (
              <Step1Content
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedKadai={selectedKadai}
                setSelectedKadai={setSelectedKadai}
                handleKadaiChange={handleKadaiChange}
                handleNext={handleNext}
                canGoNext={canGoNext}
                categories={categories}
                categoryIssues={categoryIssues}
              />
            )}

            {currentStep === 2 && (
              <Step2Content
                selectedCategory={selectedCategory}
                selectedKadai={selectedKadai}
                currentSatisfaction={currentSatisfaction}
                currentExpectation={currentExpectation}
                currentGap={currentGap}
                computedTargetSatisfaction={computedTargetSatisfaction}
                computedTargetExpectation={computedTargetExpectation}
                computedTargetGap={computedTargetGap}
                currentMeasure={measures[currentMeasureIndex]}
                currentMeasureIndex={currentMeasureIndex}
                measures={measures}
                updateMeasure={updateMeasure}
                setShowAssigneeModal={setShowAssigneeModal}
                assigneeList={assigneeList}
                handlePrevMeasure={handlePrevMeasure}
                handleNextMeasure={handleNextMeasure}
                handleGenerateNewMeasure={handleGenerateNewMeasure}
                isLoading={isLoading}
                slideDirection={slideDirection}
                handlePrev={handlePrev}
                handleNext={handleNext}
                canGoNext={canGoNext()}
                isFirstVisit={isFirstVisitToStep2} // 初回訪問フラグを渡す
                isAIGenerated={isCurrentMeasureAIGenerated()} // AI生成フラグを渡す
              />
            )}

            {currentStep === 3 && (
              <Step3Content
                selectedCategory={selectedCategory}
                selectedKadai={selectedKadai}
                currentSatisfaction={currentSatisfaction}
                currentExpectation={currentExpectation}
                currentGap={currentGap}
                computedTargetSatisfaction={computedTargetSatisfaction}
                computedTargetExpectation={computedTargetExpectation}
                computedTargetGap={computedTargetGap}
                measures={measures}
                lastViewedMeasureIndex={lastViewedMeasureIndex}
                satisfactionOffset={satisfactionOffset}
                gapOffset={gapOffset}
                setSatisfactionOffset={setSatisfactionOffset}
                setGapOffset={setGapOffset}
                handlePrev={handlePrev}
                handleFinish={handleFinish}
                canGoNext={canGoNext()}
                aiRecommended={aiRecommendedGoals} // AIによる推奨値かどうかのフラグ
              />
            )}
          </div>
        </CSSTransition>
      </div>
      {/* AIチャットボックス */}
      {isMounted && <AIChatBox />}

      {/* 担当者追加モーダル - クライアントサイドでのみレンダリング */}
      {isMounted && showAssigneeModal && (
        <AssigneeModal
          newAssignee={newAssignee}
          setNewAssignee={setNewAssignee}
          handleAddAssignee={handleAddAssignee}
          onClose={() => setShowAssigneeModal(false)}
        />
      )}

      <style jsx global>{`
        .fade-enter {
          opacity: 0;
          display: none;
        }
        .fade-enter-active {
          display: block;
          opacity: 1;
          transition: opacity 300ms ease-in-out;
          transition-delay: 300ms;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transition: opacity 300ms ease-in-out;
        }

        /* カードスライドアニメーション - 前へ移動時 */
        .card-slide-prev-enter,
        .card-slide-prev-appear {
          opacity: 0;
          transform: translateX(-100px);
        }
        .card-slide-prev-enter-active,
        .card-slide-prev-appear-active {
          opacity: 1;
          transform: translateX(0);
          transition:
            opacity 300ms,
            transform 300ms;
        }
        .card-slide-prev-exit {
          opacity: 1;
          transform: translateX(0);
        }
        .card-slide-prev-exit-active {
          opacity: 0;
          transform: translateX(100px);
          transition:
            opacity 300ms,
            transform 300ms;
        }

        /* カードスライドアニメーション - 次へ移動時 */
        .card-slide-next-enter,
        .card-slide-next-appear {
          opacity: 0;
          transform: translateX(100px);
        }
        .card-slide-next-enter-active,
        .card-slide-next-appear-active {
          opacity: 1;
          transform: translateX(0);
          transition:
            opacity 300ms,
            transform 300ms;
        }
        .card-slide-next-exit {
          opacity: 1;
          transform: translateX(0);
        }
        .card-slide-next-exit-active {
          opacity: 0;
          transform: translateX(-100px);
          transition:
            opacity 300ms,
            transform 300ms;
        }

        /* フェードイン用アニメーション */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        /* メインコンテンツのトランジション */
        #main-content {
          transition:
            transform 0.3s ease-in-out,
            width 0.3s ease-in-out;
          margin: 0 auto;
        }

        /* 縦書きテキスト用 */
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: upright;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}