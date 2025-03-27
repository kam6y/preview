import Link from "next/link";
import PersonnelHeader from "@/components/personnel/PersonnelHeader";
import PersonnelSubHeader from "@/components/common/SubHeader";

export default function PersonnelSettingsPage() {
  // 常設設問
  const defaultQuestions = [
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

  // 追加設問
  const additionalQuestions = [
    { id: 17, category: "ナレッジの標準化", question: "企業が持つ知識や情報が整理され、効率的に活用されていること。" }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* ヘッダー */}
      <PersonnelHeader />
      <PersonnelSubHeader title="設定" />

      <main className="p-6 bg-brand-lightGray">
        {/* エンゲージメントサーベイ設定 */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl text-brand-darkBlue font-bold mb-4">エンゲージメントサーベイ設定</h2>

          {/* 配信スケジュール */}
          <div className="mb-6">
            <h3 className="font-semibold flex items-center text-black text-base leading-relaxed">
              <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 配信スケジュール設定
            </h3>
            <div className="flex space-x-12 text-sm mt-2 text-black">
              <p>配信開始日: <span className="font-semibold">2021-09-06</span></p>
              <p>配信間隔: <span className="font-semibold">6ヶ月</span></p>
            </div>
          </div>

          {/* リマインダー設定 */}
          <div className="mb-6">
            <h3 className="font-semibold text-black flex items-center text-base leading-relaxed">
              <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> リマインダー設定
            </h3>
            <p className="text-black text-sm mt-2">配信間隔: <span className="font-semibold">3日</span></p>
          </div>

          {/* 常設設問リスト */}
          <h3 className="text-black font-semibold flex items-center text-base leading-relaxed mb-2">
            <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 常設設問
          </h3>
          <TableQuestions data={defaultQuestions} />

          {/* 追加設問 */}
          <h3 className="text-black font-semibold flex items-center text-base leading-relaxed mt-6 mb-2">
            <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 追加設問
          </h3>
          <TableQuestions data={additionalQuestions} />
        </section>

        {/* パルスサーベイ設定 */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl text-brand-darkBlue font-bold mb-4">パルスサーベイ設定</h2>

          {/* 配信スケジュール */}
          <div className="mb-6">
            <h3 className="font-semibold flex items-center text-black text-base leading-relaxed">
              <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> 配信スケジュール設定
            </h3>
            <p className="text-black text-sm mt-2">配信間隔: <span className="font-semibold">1週間</span></p>
          </div>

          {/* リマインダー設定 */}
          <div className="mb-6">
            <h3 className="font-semibold text-black flex items-center text-base leading-relaxed">
              <span className="w-4 h-4 bg-brand-cyan rounded-full mr-2"></span> リマインダー設定
            </h3>
            <p className="text-black text-sm mt-2">配信間隔: <span className="font-semibold">1日</span></p>
          </div>
        </section>

        {/* 編集ボタン */}
        <div className="flex justify-end mt-6">
          <Link href="/personnel/settings_register" passHref>
            <button className="bg-brand-darkBlue text-white px-8 py-3 rounded-lg shadow-md hover:bg-brand-cyan transition text-sm font-semibold">
              編集
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

/**
 * テーブルコンポーネント
 */
function TableQuestions({ data }) {
  return (
    <div className="overflow-x-auto border rounded-t-md">
      <table className="min-w-full text-sm leading-relaxed text-gray-900 border-collapse">
        <thead className="bg-gray-50 text-gray-500 uppercase">
          <tr className="">
            <th scope="col" className="px-6 py-3 font-semibold text-left">設問ID</th>
            <th scope="col" className="px-6 py-3 font-semibold text-left">設問分類</th>
            <th scope="col" className="px-6 py-3 font-semibold text-left">設問</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-2 whitespace-nowrap font-medium">{item.id}</td>
              <td className="px-6 py-2 whitespace-nowrap">{item.category}</td>
              <td className="px-6 py-2 whitespace-normal">{item.question}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}