import { useState } from "react";
import { useRouter } from "next/router";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminEditPage() {
  const router = useRouter();
  // エンゲージメントサーベイ設定
  const [engInterval, setEngInterval] = useState("6"); // 配信間隔（月単位）
  const [engReminder, setEngReminder] = useState("3"); // リマインダー（日単位）

  // パルスサーベイ設定
  const [pulseInterval, setPulseInterval] = useState("7"); // 配信間隔（日単位）
  const [pulseReminder, setPulseReminder] = useState("1"); // リマインダー（日単位）

  // 初期の常設設問（16件）
  const initialQuestions = [
    { id: 1, category: "顧客基盤の安定性", question: "企業が長期間にわたって安定した顧客関係を築き、維持している状態。" },
    { id: 2, category: "理念戦略への納得感", question: "従業員が企業のビジョンや戦略に共感し、それに対する理解と信頼を持っていること。" },
    { id: 3, category: "社会的貢献", question: "企業が社会的責任を果たし、地域社会や社会全体へ積極的に貢献している行為。" },
    { id: 4, category: "責任と顧客・社会への貢献", question: "企業が顧客への約束を守り、社会に対しても積極的に貢献している姿勢。" },
    { id: 5, category: "連帯感と相互尊重", question: "従業員間での団結力と互いの価値観を尊重する文化があること。" },
    { id: 6, category: "魅力的な上司", question: "同僚: 職場において、尊敬できる上司や魅力的な同僚がいること。" },
    { id: 7, category: "勤務地や会社設備の魅力", question: "勤務地の立地や会社の設備が充実していて働きやすい環境が整っていること。" },
    { id: 8, category: "評価・給与と柔軟な働き方", question: "公正な評価と適正な給与、柔軟な勤務体制が提供されていること。" },
    { id: 9, category: "顧客ニーズや事業戦略の伝達", question: "顧客の要望や企業の事業戦略が従業員に明確に伝えられていること。" },
    { id: 10, category: "上司や会社からの理解", question: "従業員の意見や状況に対して、上司や会社が理解と支持を示していること。" },
    { id: 11, category: "公平な評価", question: "従業員の業績や行動が公正な基準によって評価されていること。" },
    { id: 12, category: "上司からの適切な教育・支援", question: "上司が従業員の成長を支援し、必要な知識やスキルの提供を行っていること。" },
    { id: 13, category: "顧客の期待を上回る提案", question: "従業員が顧客の期待を超える提案やサービスを提供していること。" },
    { id: 14, category: "具体的な目標の共有", question: "会社の目標が明確であり、それが従業員と共有されていること。" },
    { id: 15, category: "未来に向けた活動", question: "企業が将来の成功に向けて戦略的な活動を行っていること。" },
    { id: 16, category: "ナレッジの標準化", question: "企業が持つ知識や情報が整理され、効率的に活用されていること。" },
  ];

  // 常設設問は state として管理し、初期値に空行を追加しておく（新規追加用）
  const [defaultQuestions, setDefaultQuestions] = useState([
    ...initialQuestions,
    { id: initialQuestions.length + 1, category: "", question: "" }
  ]);

  /**
   * フォーム送信時の処理（仮）
   */
  const handleSave = (e) => {
    e.preventDefault();
    // ここでAPI送信などの処理を実装
    alert("変更を保存しました！");
  };

  /**
   * キャンセルボタン押下時の処理（仮）
   */
  const handleCancel = () => {
    router.back();
  };

  /**
   * 常設設問の変更処理
   *
   * 各行の入力内容が変更された際に実行し、
   * 最後の行に入力があれば、新たな空行を追加する処理も含む
   */
  const handleQuestionChange = (index, field, value) => {
    const updated = [...defaultQuestions];
    updated[index][field] = value;
    setDefaultQuestions(updated);

    // 最後の行に入力があれば新たな空行を追加
    const lastQuestion = updated[updated.length - 1];
    if (lastQuestion.category.trim() !== "" || lastQuestion.question.trim() !== "") {
      if (updated.every(q => q.category.trim() !== "" || q.question.trim() !== "")) {
        setDefaultQuestions([...updated, { id: updated.length + 1, category: "", question: "" }]);
      }
    }
  };

  /**
   * 常設設問の削除処理
   */
  const handleDeleteQuestion = (index) => {
    const updated = defaultQuestions.filter((_, i) => i !== index);
    // 最後の行が空でなければ空行を追加
    if (
      updated.length === 0 ||
      (updated[updated.length - 1].category.trim() !== "" || updated[updated.length - 1].question.trim() !== "")
    ) {
      updated.push({ id: updated.length + 1, category: "", question: "" });
    }
    setDefaultQuestions(updated);
  };

  return (
    <div className="bg-white min-h-screen">
      <AdminHeader />

      <main className="p-6 bg-brand-lightGray">
        <form onSubmit={handleSave}>
          {/* エンゲージメントサーベイ設定 */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-3xl text-brand-darkBlue font-bold mb-4">エンゲージメントサーベイデフォルト設定</h2>

            {/* 配信スケジュール */}
            <div className="mb-6">
              <h3 className="font-semibold flex items-center text-black text-lg leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 配信スケジュール設定
              </h3>
              <div className="flex space-x-12 text-base text-black">
                <div className="flex items-center">
                  <label className="block mb-1 font-medium w-28" htmlFor="engInterval">
                    配信間隔
                  </label>
                  <input
                    id="engInterval"
                    type="number"
                    className="border px-2 py-1 rounded w-16 text-right"
                    value={engInterval}
                    onChange={(e) => setEngInterval(e.target.value)}
                  />
                  <span className="ml-2">ヶ月</span>
                </div>
              </div>
            </div>

            {/* リマインダー設定 */}
            <div className="mb-6">
              <h3 className="font-semibold text-black flex items-center text-lg leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> リマインダー設定
              </h3>
              <div className="flex items-center">
                <label className="text-black block mb-1 font-medium w-28" htmlFor="engReminder">
                  配信間隔
                </label>
                <input
                  id="engReminder"
                  type="number"
                  className="text-black border px-2 py-1 rounded w-16 text-right"
                  value={engReminder}
                  onChange={(e) => setEngReminder(e.target.value)}
                />
                <span className="text-black ml-2">日</span>
              </div>
            </div>

            {/* 常設設問の編集 */}
            <h3 className="text-black font-semibold flex items-center text-lg leading-relaxed mt-6 mb-2">
              <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 常設設問
            </h3>
            <EditableTable 
              data={defaultQuestions} 
              onChange={handleQuestionChange} 
              onDelete={handleDeleteQuestion} 
            />
          </section>

          {/* パルスサーベイ設定 */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-3xl text-brand-darkBlue font-bold mb-4">パルスサーベイデフォルト設定</h2>

            {/* 配信スケジュール */}
            <div className="mb-6">
              <h3 className="font-semibold flex items-center text-black text-lg leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 配信スケジュール設定
              </h3>
              <div className="flex items-center">
                <label className="text-black block mb-1 font-medium w-28" htmlFor="pulseInterval">
                  配信間隔
                </label>
                <input
                  id="pulseInterval"
                  type="number"
                  className="text-black border px-2 py-1 rounded w-16 text-right"
                  value={pulseInterval}
                  onChange={(e) => setPulseInterval(e.target.value)}
                />
                <span className="text-black ml-2">日</span>
              </div>
            </div>

            {/* リマインダー設定 */}
            <div className="mb-6">
              <h3 className="font-semibold text-black flex items-center text-lg leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> リマインダー設定
              </h3>
              <div className="flex items-center">
                <label className="text-black block mb-1 font-medium w-28" htmlFor="pulseReminder">
                  配信間隔
                </label>
                <input
                  id="pulseReminder"
                  type="number"
                  className="text-black border px-2 py-1 rounded w-16 text-right"
                  value={pulseReminder}
                  onChange={(e) => setPulseReminder(e.target.value)}
                />
                <span className="text-black ml-2">日</span>
              </div>
            </div>
          </section>

          {/* 保存/キャンセルボタン */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 transition text-base font-semibold"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-brand-darkBlue text-white px-8 py-3 rounded-lg shadow-md hover:bg-brand-cyan transition text-base font-semibold"
            >
              保存
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/**
 * 編集用テーブルコンポーネント（常設設問用）
 */
function EditableTable({ data, onChange, onDelete }) {
  return (
    <div className="overflow-x-auto border rounded-t-md">
      <table className="min-w-full text-base leading-relaxed text-gray-900 border-collapse">
        <thead className="bg-gray-50 text-gray-500 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold text-left">設問ID</th>
            <th scope="col" className="px-6 py-3 font-semibold text-left">設問分類</th>
            <th scope="col" className="px-6 py-3 font-semibold text-left">設問</th>
            <th scope="col" className="px-6 py-3 font-semibold text-left">削除</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {/* 設問ID（編集不可） */}
              <td className="px-6 py-2 whitespace-nowrap font-medium">{item.id}</td>
              {/* 設問分類 */}
              <td className="px-6 py-2 whitespace-nowrap">
                <input
                  type="text"
                  className="border px-2 py-1 rounded w-full"
                  value={item.category}
                  onChange={(e) => onChange(index, "category", e.target.value)}
                />
              </td>
              {/* 設問 */}
              <td className="px-6 py-2 whitespace-normal">
                <textarea
                  className="border px-2 py-1 rounded w-full"
                  rows={2}
                  value={item.question}
                  onChange={(e) => onChange(index, "question", e.target.value)}
                />
              </td>
              {/* 削除ボタン（最後の空行の場合は非表示） */}
              <td className="px-6 py-2 whitespace-nowrap">
                {!(index === data.length - 1 && data[index].category.trim() === "" && data[index].question.trim() === "") && (
                  <button onClick={() => onDelete(index)} className="text-red-500">
                    削除
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}