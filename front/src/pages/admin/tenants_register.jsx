import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminTenantsRegisterPage() {
  const router = useRouter()

  // フォーム入力状態
  const [companyName, setCompanyName] = useState('')
  const [domain, setDomain] = useState('')
  // 必要に応じて他の項目を追加可能

  // フォーム送信時の処理
  const handleSubmit = (e) => {
    e.preventDefault()
    // API経由で登録処理を実施する場合はここで実装
    alert('テナントを登録しました！')
    router.push('/admin/tenants')
  }

  // キャンセル時は一覧画面へ戻る
  const handleCancel = () => {
    router.push('/admin/tenants')
  }

  return (
    <div className="min-h-screen bg-brand-lightGray">
      {/* ヘッダー */}
      <div className="bg-white">
        <AdminHeader />
      </div>

      {/* カードコンテナ */}
      <div className="mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {/* テナント追加・検索・フィルター */}
          <div className="flex justify-between mb-2">
            <h2 className="text-3xl mt-2 pl-2 font-bold text-brand-darkBlue">
              テナント登録
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <p className='text-black my-2'>登録された時点で代表者メールアドレスにメールが送付されます。</p>
            {/* 社名 */}
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-brand-darkBlue font-bold mb-2"
              >
                社名
              </label>
              <input
                type="text"
                id="companyName"
                placeholder="例: 株式会社A"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black focus:outline-none focus:border-brand-cyan"
              />
            </div>
            {/* ドメイン */}
            <div className="mb-4">
              <label
                htmlFor="domain"
                className="block text-brand-darkBlue font-bold mb-2"
              >
                代表者メールアドレス
              </label>
              <input
                type="mail"
                id="domain"
                placeholder="例: user@example.co.jp"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black focus:outline-none focus:border-brand-cyan"
              />
            </div>
            {/* 必要に応じてその他の入力項目を追加 */}

            {/* ボタン群 */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded px-4 py-2 text-base font-semibold bg-gray-300 text-black hover:bg-gray-400 transition"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded px-4 py-2 text-base font-semibold bg-brand-cyan text-white hover:bg-brand-teal transition"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
