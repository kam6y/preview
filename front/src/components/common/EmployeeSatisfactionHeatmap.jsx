// front/src/components/common/EmployeeSatisfactionHeatmap.jsx
import React, { useState } from 'react'

const EmployeeSatisfactionHeatmap = ({ defaultCategories, customCategories, data }) => {
  // 表示する質問カテゴリーの種類をトグルするための状態
  const [showCustomQuestions, setShowCustomQuestions] = useState(true)
  
  // 指標と比較表示のための状態
  const [selectedMetric, setSelectedMetric] = useState('score')
  const [showComparison, setShowComparison] = useState(true)

  // マウスオーバー状態を管理
  const [hoveredDepartment, setHoveredDepartment] = useState(null)

  // 指標選択オプション
  const metricOptions = [
    { value: 'score', label: 'スコア' },
    { value: 'gap', label: 'ギャップ値' }
  ]

  // 値に基づいて背景色と文字色を決定する関数
  const getStyles = (value) => {
    if (value === null || value === undefined) {
      return { bgColor: 'bg-white', textColor: 'text-gray-800' }
    }

    // 前回比表示モードと通常表示モードで異なる色分け基準を使用
    if (showComparison) {
      // 前回比表示モード - 元のロジックを維持
      if (value > 1) {
        return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' } // 良好（黄色）
      }
      if (value > 0) {
        return { bgColor: 'bg-green-100', textColor: 'text-green-800' } // 普通（薄緑）
      }
      if (value > -1) {
        return { bgColor: 'bg-green-50', textColor: 'text-green-700' } // やや良い（さらに薄い緑）
      }
      if (value > -2) {
        return { bgColor: 'bg-red-100', textColor: 'text-red-700' } // やや悪い（薄赤）
      }
      if (value > -3) {
        return { bgColor: 'bg-red-200', textColor: 'text-red-800' } // 悪い（中赤）
      }
      return { bgColor: 'bg-red-300', textColor: 'text-red-900' } // 非常に悪い（濃い赤）
    } else {
      // 通常表示モード - 新しい色分け基準
      if (selectedMetric === 'score') {
        // スコア値の場合の色分け基準
        if (value > 70) {
          return { bgColor: 'bg-green-200', textColor: 'text-green-800' } // 非常に良い（濃い緑）
        }
        if (value > 60) {
          return { bgColor: 'bg-green-100', textColor: 'text-green-800' } // 良い（緑）
        }
        if (value > 50) {
          return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' } // 普通（黄色）
        }
        if (value > 40) {
          return { bgColor: 'bg-red-100', textColor: 'text-red-700' } // 悪い（薄赤）
        }
        return { bgColor: 'bg-red-300', textColor: 'text-red-900' } // 非常に悪い（濃い赤）
      } else {
        // GAP値の場合の色分け基準
        if (value > 0) {
          return { bgColor: 'bg-green-100', textColor: 'text-green-800' } // プラス（良い）
        }
        if (value > -2) {
          return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' } // やや低い（注意）
        }
        if (value > -4) {
          return { bgColor: 'bg-red-100', textColor: 'text-red-700' } // 低い（悪い）
        }
        return { bgColor: 'bg-red-300', textColor: 'text-red-900' } // 非常に低い（非常に悪い）
      }
    }
  }

  // 質問カテゴリーを表示する関数（横書きで表示）
  const formatCategoryName = (category) => {
    // 短い名前はそのまま表示、長い名前は複数行に分割
    if (category.length <= 10) {
      return <div className="whitespace-normal text-center text-xs">{category}</div>;
    }
    
    // 長いカテゴリ名を適切に分割
    const middle = Math.ceil(category.length / 2);
    const firstLine = category.substring(0, middle);
    const secondLine = category.substring(middle);
    
    return (
      <div className="whitespace-normal text-center">
        <div className="text-xs">{firstLine}</div>
        <div className="text-xs">{secondLine}</div>
      </div>
    );
  }

  // 指標と前回比に基づいて適切な値を取得
  const getCellValue = (row, category, isCustom) => {
    const categoryData = isCustom ? row.customCategories : row.defaultCategories;
    
    // 選択された指標に基づいて値を返す
    return selectedMetric === 'score' ? row.score : categoryData[category];
  }

// 部署の詳細画面に遷移する関数
const navigateToDepartmentDetail = (departmentId) => {
  // 現在のURLからクエリパラメータとパス情報を取得
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;
  const pathSegments = currentUrl.pathname.split('/');
  
  // 現在のパスの最後のセグメントをissueに置き換える
  // 例: /admin/dashboard -> /admin/issue
  pathSegments.pop(); // 最後のセグメント(dashboard)を削除
  const basePath = pathSegments.join('/');
  const issuePath = `${basePath}/issue`;
  
  // 新しいURLを作成
  const newUrl = new URL(issuePath, window.location.origin);
  
  // 部署IDを設定
  newUrl.searchParams.set('departmentId', departmentId);
  
  // 現在の他のパラメータをすべて新しいURLに引き継ぐ
  for (const [key, value] of searchParams.entries()) {
    // 'id' パラメータは上書きしないように注意
    if (key !== 'id') {
      newUrl.searchParams.set(key, value);
    }
  }
  
  // 新しいURLに遷移
  console.log(`部署詳細画面に遷移: ${newUrl.pathname}${newUrl.search}`);
  window.location.href = `${newUrl.pathname}${newUrl.search}`;
}

  // 行の高さを統一する定数
  const ROW_HEIGHT = '53px' // 一般的な行の高さ
  const HEADER_ROW_HEIGHT = '41px' // ヘッダー行の高さ
  const DOUBLE_HEADER_HEIGHT = `${parseInt(HEADER_ROW_HEIGHT) * 2}px`
  const TRIPLE_HEADER_HEIGHT = `${parseInt(HEADER_ROW_HEIGHT) * 3}px`

  // 列幅を一定にする
  const DEFAULT_COL_WIDTH = '80px'  // デフォルト質問の列幅
  const CUSTOM_COL_WIDTH = '80px'   // 追加質問の列幅

  return (
    <div className="w-full mx-auto bg-white p-3 rounded-lg">
      <div className="mb-3 flex justify-between items-center">
        
        <div className="flex flex-wrap gap-3">
          {/* 指標選択 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">指標:</span>
            <select
              className="px-2 py-1 border rounded text-sm bg-white text-gray-800"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {metricOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 前回比切替 */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={() => setShowComparison(!showComparison)}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700">前回比を表示</span>
            </label>
          </div>
          
          {/* 追加質問切替とカラー凡例 */}
          <div className="flex items-center space-x-4">
            <div>
              <button
                className={`px-2 py-1 text-sm rounded ${showCustomQuestions ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => setShowCustomQuestions(!showCustomQuestions)}
              >
                {showCustomQuestions ? 'デフォルト質問のみ' : '追加質問を表示'}
              </button>
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-2 text-gray-700">凡例:</span>
              <div className="flex space-x-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-300 mr-1"></div>
                  <span className="text-red-800">要改善</span>
                </div>
                <div className="flex items-center ml-1">
                  <div className="w-3 h-3 bg-green-100 mr-1"></div>
                  <span className="text-green-800">良好</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 目立つようにしたナビゲーション説明 */}
      <div className="mt-3 mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center shadow-sm w-96">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-brand-darkBlue">部署名をクリックすると詳細画面に移動します</span>
      </div>

      <div className="border rounded">
        <div className="flex">
          {/* 固定列部分 */}
          <div className="border-r">
            <table className="border-collapse">
              <thead>
                <tr
                  className="bg-gray-100"
                  style={{ height: TRIPLE_HEADER_HEIGHT }}
                >
                  <th
                    className="border-b border-r p-1 text-left text-sm text-gray-700"
                    style={{ width: '120px' }}
                  >
                    部署
                  </th>
                  <th
                    className="border-b p-1 text-center text-sm text-gray-700 "
                    style={{ width: '50px' }}
                  >
                    {selectedMetric === 'score' ? 'スコア' : 'GAP'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    style={{ height: ROW_HEIGHT }}
                  >
                    <td 
                      className={`border-b border-r p-1 text-sm ${
                        hoveredDepartment === row.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-800'
                      }`}
                      onMouseEnter={() => setHoveredDepartment(row.id)}
                      onMouseLeave={() => setHoveredDepartment(null)}
                    >
                      <div className="flex items-center">
                        <button 
                          onClick={() => navigateToDepartmentDetail(row.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              navigateToDepartmentDetail(row.id);
                            }
                          }}
                          className={`flex items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-sm px-1 py-0.5 ${
                            hoveredDepartment === row.id
                              ? 'text-blue-700'
                              : 'text-gray-800'
                          }`}
                          tabIndex={0}
                          aria-label={`${row.department}の詳細を表示`}
                          title={`${row.department}の詳細を表示`}
                        >
                          <div className="flex items-center gap-1">
                            <span>{row.department}</span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${
                                hoveredDepartment === row.id 
                                  ? 'text-blue-500' 
                                  : 'text-gray-400'
                              }`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </td>
                    <td className="border-b p-1 text-center text-sm text-gray-800">
                      {selectedMetric === 'score' ? row.score : row.gap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* スクロール可能部分 */}
          <div
            className="overflow-x-auto"
            style={{ maxWidth: 'calc(100% - 170px)' }}
          >
            <table className="border-collapse">
              <thead>
                <tr
                  className="bg-gray-100"
                  style={{ height: HEADER_ROW_HEIGHT }}
                >
                  <th
                    className="border-b p-1 text-center bg-gray-200 text-sm text-gray-800 "
                    colSpan={defaultCategories.length}
                  >
                    デフォルト質問
                  </th>
                  {showCustomQuestions && (
                    <th
                      className="border-b p-1 text-center bg-blue-100 text-sm text-gray-800"
                      colSpan={customCategories.length}
                    >
                      追加質問
                    </th>
                  )}
                </tr>
                <tr
                  className="bg-gray-100"
                  style={{ height: DOUBLE_HEADER_HEIGHT }}
                >
                  {/* デフォルト質問カテゴリー */}
                  {defaultCategories.map((cat) => (
                    <th
                      key={cat.id}
                      className="border-b border-r p-1 text-center text-xs text-gray-700"
                      style={{ width: DEFAULT_COL_WIDTH }}
                    >
                      <div title={cat.category} className="text-center">
                        {formatCategoryName(cat.category)}
                      </div>
                    </th>
                  ))}

                  {/* 追加質問カテゴリー */}
                  {showCustomQuestions &&
                    customCategories.map((cat) => (
                      <th
                        key={cat.id}
                        className="border-b border-r p-1 text-center bg-blue-50 text-xs text-gray-800"
                        style={{ width: CUSTOM_COL_WIDTH }}
                      >
                        <div title={cat.category} className="text-center">
                          {formatCategoryName(cat.category)}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    style={{ height: ROW_HEIGHT }}
                  >
                    {/* デフォルト質問のセル */}
                    {defaultCategories.map((cat) => {
                      // 選択された指標と比較モードに基づいて値を取得
                      const value = showComparison ? 
                        row.defaultCategories[cat.category] : 
                        getCellValue(row, cat.category, false);
                      const styles = getStyles(value);
                      return (
                        <td
                          key={`${row.department}-${cat.id}`}
                          className={`border-b border-r p-1 text-center text-sm ${styles.bgColor} ${styles.textColor}`}
                          style={{ width: DEFAULT_COL_WIDTH }}
                        >
                          {value}
                        </td>
                      )
                    })}

                    {/* 追加質問のセル */}
                    {showCustomQuestions &&
                      customCategories.map((cat) => {
                        // 選択された指標と比較モードに基づいて値を取得
                        const value = showComparison ? 
                          row.customCategories[cat.category] : 
                          getCellValue(row, cat.category, true);
                        const styles = getStyles(value);
                        return (
                          <td
                            key={`${row.department}-${cat.id}`}
                            className={`border-b border-r p-1 text-center text-sm ${styles.bgColor} ${styles.textColor}`}
                            style={{ width: CUSTOM_COL_WIDTH }}
                          >
                            {value}
                          </td>
                        )
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        * {showComparison 
          ? `表示されているのは${selectedMetric === 'gap' ? 'GAP' : 'スコア'}の前回比です。${selectedMetric === 'gap' ? '正の値が改善' : '正の値が向上'}を示しています。` 
          : `表示されているのは現在の${selectedMetric === 'gap' ? 'GAP' : 'スコア'}値です。`}
      </div>
    </div>
  )
}

export default EmployeeSatisfactionHeatmap