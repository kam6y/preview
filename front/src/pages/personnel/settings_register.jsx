// personnel_edit_page.jsx の修正版
import { useState } from "react";
import { useRouter } from "next/router";
import PersonnelHeader from "@/components/personnel/PersonnelHeader";
import PersonnelSubHeader from "@/components/common/SubHeader";

/**
 * 人事部ダッシュボードの「編集」ページ
 */
export default function PersonnelEditPage() {
  const router = useRouter();

  // エンゲージメントサーベイの初期値
  const [startDate, setStartDate] = useState("2021-09-06");
  const [engInterval, setEngInterval] = useState("6"); // 配信間隔（月単位）
  const [engReminder, setEngReminder] = useState("3"); // リマインダー（日単位）

  // パルスサーベイの初期値
  const [pulseInterval, setPulseInterval] = useState("7"); // 配信間隔（日単位）
  const [pulseReminder, setPulseReminder] = useState("1"); // リマインダー（日単位）

  // 追加設問（空の行を1つ初期追加）
  const [additionalQuestions, setAdditionalQuestions] = useState([
    { id: 17, category: "", question: "" },
  ]);

  /**
   * フォーム送信時の処理 (仮)
   */
  const handleSave = (e) => {
    e.preventDefault();
    // ここでAPI送信などの処理を実装
    alert("変更を保存しました！");
  };

  /**
   * キャンセルボタン押下時の処理 (仮)
   */
  const handleCancel = () => {
    router.back();
  };

  /**
   * 追加設問の自動行追加処理
   */
  const handleQuestionChange = (index, field, value) => {
    const updated = [...additionalQuestions];
    updated[index][field] = value;
    setAdditionalQuestions(updated);

    // 最後の行に何か入力があれば、新しい空行を追加
    const lastQuestion = updated[updated.length - 1];
    if (lastQuestion.category.trim() !== "" || lastQuestion.question.trim() !== "") {
      // すでに空行がなければ追加
      if (updated.every(q => q.category.trim() !== "" || q.question.trim() !== "")) {
        setAdditionalQuestions([...updated, { id: updated.length + 17, category: "", question: "" }]);
      }
    }
  };

  /**
   * 追加設問を削除する処理
   */
  const handleDeleteQuestion = (index) => {
    const updated = additionalQuestions.filter((_, i) => i !== index);
    // 最後の行が空行でない場合、空行を追加
    if (
      updated.length === 0 ||
      (updated[updated.length - 1].category.trim() !== "" || updated[updated.length - 1].question.trim() !== "")
    ) {
      updated.push({ id: updated.length + 17, category: "", question: "" });
    }
    setAdditionalQuestions(updated);
  };

  return (
    <div className="bg-white min-h-screen">
      <PersonnelHeader />
      <PersonnelSubHeader title="設定（編集モード）" />

      <main className="p-6 bg-brand-lightGray">
        <form onSubmit={handleSave}>
          {/* エンゲージメントサーベイ設定 */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl text-brand-darkBlue font-bold mb-4">エンゲージメントサーベイ設定</h2>

            {/* 配信スケジュール */}
            <div className="mb-6">
              <h3 className="font-semibold flex items-center text-black text-base leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 配信スケジュール設定
              </h3>
              <div className="flex space-x-12 text-sm text-black">
                <div className="flex items-center">
                  <label className="block mb-1 font-medium w-28" htmlFor="startDate">
                    配信開始日
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="border px-2 py-1 rounded text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <label className="block mb-1 font-medium w-28" htmlFor="engInterval">
                    配信間隔
                  </label>
                  <input
                    id="engInterval"
                    type="number"
                    className="border px-2 py-1 rounded w-16 text-right text-sm"
                    value={engInterval}
                    onChange={(e) => setEngInterval(e.target.value)}
                  />
                  <span className="ml-2">ヶ月</span>
                </div>
              </div>
            </div>

            {/* リマインダー設定 */}
            <div className="mb-6">
              <h3 className="font-semibold text-black flex items-center text-base leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> リマインダー設定
              </h3>
              <div className="flex items-center">
                <label className="text-black block mb-1 font-medium w-28" htmlFor="engReminder">
                  配信間隔
                </label>
                <input
                  id="engReminder"
                  type="number"
                  className="text-black border px-2 py-1 rounded w-16 text-right text-sm"
                  value={engReminder}
                  onChange={(e) => setEngReminder(e.target.value)}
                />
                <span className="text-black ml-2">日</span>
              </div>
            </div>

            {/* 追加設問 */}
            <h3 className="text-black font-semibold flex items-center text-base leading-relaxed mt-6 mb-2">
              <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 追加設問
            </h3>
            <EditableTable 
              data={additionalQuestions} 
              onChange={handleQuestionChange} 
              onDelete={handleDeleteQuestion} 
            />
          </section>

          {/* パルスサーベイ設定 */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl text-brand-darkBlue font-bold mb-4">パルスサーベイ設定</h2>

            {/* 配信スケジュール */}
            <div className="mb-6">
              <h3 className="font-semibold flex items-center text-black text-base leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 配信スケジュール設定
              </h3>
              <div className="flex items-center">
                <label className="text-black block mb-1 font-medium w-28" htmlFor="pulseInterval">
                  配信間隔
                </label>
                <input
                  id="pulseInterval"
                  type="number"
                  className="text-black border px-2 py-1 rounded w-16 text-right text-sm"
                  value={pulseInterval}
                  onChange={(e) => setPulseInterval(e.target.value)}
                />
                <span className="text-black ml-2">日</span>
              </div>
            </div>

            {/* リマインダー設定 */}
            <div className="mb-6">
              <h3 className="font-semibold text-black flex items-center text-base leading-relaxed mb-2">
                <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> リマインダー設定
              </h3>
              <div className="text-black flex items-center">
                <label className="block mb-1 font-medium w-28" htmlFor="pulseReminder">
                  配信間隔
                </label>
                <input
                  id="pulseReminder"
                  type="number"
                  className="text-black border px-2 py-1 rounded w-16 text-right text-sm"
                  value={pulseReminder}
                  onChange={(e) => setPulseReminder(e.target.value)}
                />
                <span className="ml-2">日</span>
              </div>
            </div>
          </section>

          {/* 保存/キャンセルボタン */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 transition text-sm font-semibold"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-brand-darkBlue text-white px-8 py-3 rounded-lg shadow-md hover:bg-brand-cyan transition text-sm font-semibold"
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
 * 編集用のテーブルコンポーネント（追加設問用）
 */
function EditableTable({ data, onChange, onDelete }) {
  return (
    <div className="overflow-x-auto border rounded-t-md">
      <table className="min-w-full text-sm leading-relaxed text-gray-900 border-collapse">
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
                  className="border px-2 py-1 rounded w-full text-sm"
                  value={item.category}
                  onChange={(e) => onChange(index, "category", e.target.value)}
                />
              </td>
              {/* 設問 */}
              <td className="px-6 py-2 whitespace-normal">
                <textarea
                  className="border px-2 py-1 rounded w-full text-sm"
                  rows={2}
                  value={item.question}
                  onChange={(e) => onChange(index, "question", e.target.value)}
                />
              </td>
              {/* 削除ボタン（最後の空行の場合は表示しない） */}
              <td className="px-6 py-2 whitespace-nowrap">
                {!(index === data.length - 1 && data[index].category.trim() === "" && data[index].question.trim() === "") && (
                  <button onClick={() => onDelete(index)} className="text-red-500 text-sm">
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