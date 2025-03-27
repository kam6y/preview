// front/src/components/common/SuccessCaseTable.jsx
import React, { useState } from 'react';

const SuccessCaseTable = ({ data, categories }) => {
  const [filter, setFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);

  // 部署リストの取得
  const departments = [...new Set(data ? data.map(item => item.department) : [])];

  // フィルタリング済みデータ
  const filteredData = data ? data.filter(item => {
    const matchesCategory = !filter || item.category === filter;
    const matchesDepartment = !departmentFilter || item.department === departmentFilter;
    const matchesSearch = !search || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.issue.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesDepartment && matchesSearch;
  }) : [];

  const clearFilters = () => {
    setFilter('');
    setDepartmentFilter('');
    setSearch('');
  };

  const handleRowClick = (item) => {
    setSelectedCase(item);
  };

  const closeDetails = () => {
    setSelectedCase(null);
  };

  // 親コンポーネントから受け取ったデータを使用
  const displayData = filteredData.length > 0 ? filteredData : data || [];
  const displayCategories = categories && categories.length > 0 ? categories : ["効率化", "教育", "マーケティング", "働き方"];

  // モーダル表示用のコンポーネント
  const SuccessCaseDetails = ({ caseData, onClose }) => {
    if (!caseData) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-brand-darkBlue mb-2">{caseData.title}</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">カテゴリー</p>
                <p className="font-medium text-gray-800">
                  <span className="inline-block px-2 py-1 bg-opacity-20 rounded text-sm mt-1" 
                  style={{ backgroundColor: `${caseData.category === '効率化' ? '#17839433' : caseData.category === '教育' ? '#00A3B333' : caseData.category === 'マーケティング' ? '#F2975933' : caseData.category === '働き方' ? '#FC7F7A33' : '#00425933'}` }}>
                    {caseData.category}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">担当部署</p>
                <p className="font-medium text-gray-800">{caseData.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">担当者</p>
                <p className="font-medium flex items-center">
                  <span className="w-6 h-6 rounded-full bg-brand-teal bg-opacity-20 text-brand-teal text-xs flex items-center justify-center mr-2">
                    {caseData.manager.charAt(0)}
                  </span>
                  {caseData.manager}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">課題</p>
                <p className="font-medium text-gray-800">{caseData.issue}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2 text-brand-darkBlue">施策詳細</h3>
              <p className="text-gray-800">{caseData.description || "詳細情報はまだ登録されていません。"}</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-brand-teal text-white rounded hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-brand-teal"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 説明テキスト - 情報アイコン付き */}
      <div className="p-4">
        <div className="inline-flex items-center gap-2 bg-brand-lightGray rounded-md px-4 py-2 border border-gray-200">
          <div className="text-brand-teal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          </div>
          <p className="text-gray-800 font-medium">部署名をクリックすると詳細画面に移動します</p>
        </div>
      </div>
      
      {/* フィルター部分 */}
      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="施策名・課題で検索"
            className="border rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select 
            className="border rounded-md p-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-800"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">カテゴリー: すべて</option>
            {displayCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            className="border rounded-md p-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-800"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">担当部署: すべて</option>
            {departments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
          
          {(filter || departmentFilter || search) && (
            <button 
              className="border rounded-md p-2 text-sm hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-800"
              onClick={clearFilters}
            >
              フィルターをクリア
            </button>
          )}
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-brand-teal text-white">
                <th className="p-3 text-left">施策内容</th>
                <th className="p-3 text-left">課題カテゴリ</th>
                <th className="p-3 text-left">課題</th>
                <th className="p-3 text-left">担当者</th>
                <th className="p-3 text-left">担当部署</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, index) => (
                <tr 
                  key={index} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-brand-lightGray'} hover:bg-brand-lightGray cursor-pointer transition-colors text-gray-800`}
                  onClick={() => handleRowClick(item)}
                  title="クリックして詳細を表示"
                >
                  <td className="p-3 font-medium text-brand-darkBlue">{item.title}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-opacity-20 rounded text-sm" style={{ backgroundColor: `${item.category === '効率化' ? '#17839433' : item.category === '教育' ? '#00A3B333' : item.category === 'マーケティング' ? '#F2975933' : item.category === '働き方' ? '#FC7F7A33' : '#00425933'}` }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">{item.issue}</td>
                  <td className="p-3">
                    <span className="flex items-center">
                      <span className=" w-6 h-6 rounded-full bg-brand-teal bg-opacity-20 text-brand-teal text-xs flex items-center justify-center mr-1">
                        {item.manager.charAt(0)}
                      </span>
                      {item.manager}
                    </span>
                  </td>
                  <td className="p-3">{item.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayData.length === 0 && (
          <div className="p-8 text-center text-gray-800">
            条件に一致する施策がありません。フィルターを変更してください。
          </div>
        )}

        {selectedCase && (
          <SuccessCaseDetails 
            caseData={selectedCase} 
            onClose={closeDetails} 
          />
        )}
      </div>
    </div>
  );
};

export default SuccessCaseTable;