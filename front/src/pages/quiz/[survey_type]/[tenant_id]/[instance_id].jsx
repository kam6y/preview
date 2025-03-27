// pages/quiz/quiz/[tenant_id]/[instance_id].jsx

import { useState } from "react";
import { useRouter } from "next/router";
import Quiz from "../../../../components/questionnaire/Quiz.js";

export default function QuizPage() {
    // Next.js のルーターからパラメータを取得
    const router = useRouter();
    const { survey_type, tenant_id, instance_id } = router.query;

    const [step, setStep] = useState(0);

    // 「やり直す」ボタンのクリック時にステップ0にリセット
    const handleRestart = () => {
        setStep(0);
    };

    return (
        <div className="bg-[#F1F4F5] min-h-screen">
            <header className="bg-brand-teal text-white h-12 px-4 flex justify-between items-center shadow-md sticky top-0 z-50">
                <div className="flex mx-auto items-center cursor-pointer">
                    <h1 className="pl-4 text-3xl font-bold">Motiva</h1>
                    {/* やり直すボタン */}
                    <button
                        onClick={handleRestart}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 text-white rounded-md hover:bg-red-700"
                    >
                        やり直す
                    </button>
                </div>
            </header>

            <main className="min-h-[calc(100vh-48px)]">
                {/* 取得した tenant_id, instance_id を Quiz コンポーネントに渡す */}
                <Quiz
                    step={step}
                    setStep={setStep}
                    surveytype={survey_type}
                    tenantId={tenant_id}
                    instanceId={instance_id}
                />
            </main>
        </div>
    );
}
