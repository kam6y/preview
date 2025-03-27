import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import AdminHeader from '@/components/admin/AdminHeader'

// Recharts
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/**
 * 60社分のダミーデータを生成する関数
 */
function generateRandomTenants(count) {
  const tenants = []
  for (let i = 0; i < count; i++) {
    const tenantId = i + 1
    const companyLetter = String.fromCharCode(65 + (i % 26)) // A～Z
    const companyName = `株式会社${companyLetter}${tenantId}`
    const domain = `company${tenantId}.co.jp`
    const responseRate = Math.floor(Math.random() * 51) + 50 // 50%～100%
    const scoreTrend = Array.from({ length: 5 }, (_, idx) => ({
      name: `${idx + 1}月`,
      score: Math.floor(Math.random() * 100),
    }))
    const numNotifications = Math.floor(Math.random() * 4) // 0～3件
    const notifications = Array.from({ length: numNotifications }, (_, j) => ({
      id: tenantId * 100 + j,
      companyDept: `株式会社${companyLetter} 営業部`,
      title: '通知タイトル',
      message: 'ダミー通知メッセージ',
      date: `${Math.floor(Math.random() * 15) + 1}日前`,
    }))

    tenants.push({
      tenantId,
      companyName,
      domain,
      responseRate,
      scoreTrend,
      notifications,
    })
  }
  return tenants
}

/**
 * Next.js の SSG 用：サーバーサイドでダミーデータを生成
 */
export async function getStaticProps() {
  const initialTenants = generateRandomTenants(60)
  return {
    props: {
      initialTenants,
    },
  }
}

/**
 * メインページコンポーネント
 */
export default function AdminTenantsPage({ initialTenants }) {
  const router = useRouter()
  const [tenants] = useState(initialTenants)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({
    sortKey: '',
    sortOrder: 'asc',
  })

  // ページネーション設定：1ページ20社
  const itemsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)

  const handleAddTenant = () => {
    router.push('/admin/tenants_register')
  }

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.sortKey === key) {
        return {
          sortKey: key,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }
      } else {
        return { sortKey: key, sortOrder: 'asc' }
      }
    })
  }

  const filteredSortedTenants = useMemo(() => {
    let data = tenants.filter((t) => {
      const targetText = (t.companyName + t.domain + t.tenantId).toLowerCase()
      return targetText.includes(searchKeyword.toLowerCase())
    })
    data = data.filter((t) => {
      switch (filter) {
        case 'under50':
          return t.responseRate < 50
        case 'between50_80':
          return t.responseRate >= 50 && t.responseRate <= 80
        case 'over80':
          return t.responseRate > 80
        default:
          return true
      }
    })
    if (sortConfig.sortKey) {
      data.sort((a, b) => {
        const { sortKey, sortOrder } = sortConfig
        let valA = a[sortKey]
        let valB = b[sortKey]
        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
    return data
  }, [tenants, searchKeyword, filter, sortConfig])

  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredSortedTenants.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredSortedTenants, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredSortedTenants.length / itemsPerPage)

  const handleGoToDetail = (tenantId) => {
    router.push(`/admin/tenants_dashboard?tenants_id=${tenantId}`)
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
              テナント一覧
            </h2>
            <div>
              <button
                onClick={handleAddTenant}
                className="rounded px-4 mt-8 py-2 text-base font-semibold bg-brand-cyan text-white hover:bg-brand-teal transition"
              >
                テナント追加
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <input
              type="text"
              placeholder="検索（社名・ドメイン・ID）"
              className="border border-gray-300 rounded px-3 py-2 bg-white text-black w-64"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value)
                setCurrentPage(1)
              }}
            />
            <select
              className="border border-gray-300 rounded px-3 py-2 bg-white text-black"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">すべて表示</option>
              <option value="under50">回答率50%未満</option>
              <option value="between50_80">回答率50%～80%</option>
              <option value="over80">回答率80%以上</option>
            </select>
          </div>

          {/* テナント一覧表 */}
          <div>
            <table className="w-full border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-brand-darkBlue text-white border-b border-gray-300">
                  <TableHeader
                    label="テナントID"
                    sortKey="tenantId"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    width="100px"
                  />
                  <TableHeader
                    label="社名"
                    sortKey="companyName"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    width="180px"
                  />
                  <TableHeader
                    label="ドメイン"
                    sortKey="domain"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    width="200px"
                  />
                  <TableHeader
                    label="回答率"
                    sortKey="responseRate"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    width="100px"
                  />
                  <th
                    className="px-2 py-2 border-r border-gray-300 text-left"
                    style={{ width: '220px' }}
                  >
                    平均スコア分布
                  </th>
                  <th
                    className="px-2 py-2 border-r border-gray-300 text-left"
                    style={{ width: '120px' }}
                  >
                    通知
                  </th>
                  <th
                    className="px-2 py-2 text-left"
                    style={{ width: '100px' }}
                  >
                    詳細
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTenants.map((tenant) => (
                  <tr
                    key={tenant.tenantId}
                    className="border-b border-gray-300 bg-white text-black"
                  >
                    <td className="px-2 py-2" style={{ width: '100px' }}>
                      {tenant.tenantId}
                    </td>
                    <td className="px-2 py-2" style={{ width: '180px' }}>
                      {tenant.companyName}
                    </td>
                    <td className="px-2 py-2" style={{ width: '200px' }}>
                      {tenant.domain}
                    </td>
                    <td className="px-2 py-2" style={{ width: '100px' }}>
                      {tenant.responseRate}%
                    </td>
                    {/* 平均スコア分布：Y軸を0～100に固定、グラフの幅をカラム幅に合わせる */}
                    <td className="py-2" style={{ width: '220px' }}>
                      <div className="w-full h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={tenant.scoreTrend}>
                            <XAxis dataKey="name" hide />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 10, fill: '#000000' }}
                              axisLine={{ stroke: '#ccc' }}
                              tickLine={{ stroke: '#ccc' }}
                              width={20}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                borderColor: '#ccc',
                                color: '#000000',
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#00A3B3" // brand-cyan
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td
                      className="px-2 py-2 relative text-brand-cyan"
                      style={{ width: '120px' }}
                    >
                      <div className="group inline-block cursor-pointer">
                        通知({tenant.notifications.length})
                        {tenant.notifications.length > 0 && (
                          <div className="hidden group-hover:block absolute left-0 top-8 mt-2 w-72 bg-white text-black border border-gray-300 rounded shadow-md z-10">
                            {tenant.notifications.map((note) => (
                              <div
                                key={note.id}
                                className="relative flex items-start p-3 last:mb-0 hover:bg-gray-100 rounded"
                              >
                                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />
                                <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex-shrink-0" />
                                <div className="text-sm">
                                  <div className="font-semibold text-gray-800">
                                    {note.companyDept}
                                  </div>
                                  <div className="text-gray-600">
                                    {note.title}：{note.message}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {note.date}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2" style={{ width: '100px' }}>
                      <button
                        onClick={() => handleGoToDetail(tenant.tenantId)}
                        className="rounded bg-brand-orange text-white px-3 py-1 hover:bg-brand-coral transition"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          <div className="flex items-center justify-end mt-4 gap-3">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="text-xl text-brand-darkBlue disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            <div className="bg-gray-100 text-black min-w-[40px] text-center rounded px-3 py-1">
              {currentPage}
            </div>
            <span className="text-gray-600">of</span>
            <div className="bg-gray-100 text-black min-w-[40px] text-center rounded px-3 py-1">
              {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="text-xl text-brand-darkBlue disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * テーブルのヘッダセル（ソート機能付き）
 */
function TableHeader({ label, sortKey, sortConfig, onSort, width }) {
  const isActive = sortConfig.sortKey === sortKey
  const arrow = isActive ? (sortConfig.sortOrder === 'asc' ? '▲' : '▼') : ''
  return (
    <th
      className="px-2 py-2 cursor-pointer select-none border-r border-gray-300 text-left"
      style={{ width }}
      onClick={() => onSort(sortKey)}
    >
      {label}
      {arrow && <span className="ml-1">{arrow}</span>}
    </th>
  )
}
