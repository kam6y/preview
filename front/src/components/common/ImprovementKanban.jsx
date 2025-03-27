import React, { useState } from 'react';
import MeasureModal from '../common/MeasureModal';
import { useRouter } from 'next/router';

// 施策のステータス定義
const statuses = [
  { id: 'planning', name: '計画中', color: 'bg-brand-cyan' },
  { id: 'inProgress', name: '実行中', color: 'bg-brand-teal' },
  { id: 'systemized', name: '仕組み化', color: 'bg-brand-orange' },
  { id: 'archived', name: 'アーカイブ', color: 'bg-brand-darkBlue text-white' },
];

const ImprovementKanban = ({ 
  selectedOrganization = 'AAA',
  initialImprovements,
  showRegisterButton = true  // 追加：ボタン表示の有無を制御するprop
}) => {
  const router = useRouter(); // Next.jsのルーターを初期化
  
  // モーダル表示用の状態
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // モーダルを開く関数
  const openModal = (measure) => {
    setSelectedMeasure(measure);
    setIsModalOpen(true);
  };
  
  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMeasure(null);
  };

  // 親コンポーネントから渡されたデータを使用
  const [improvements, setImprovements] = useState(initialImprovements || []);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');
  const [selectedTab, setSelectedTab] = useState('すべて');
  const [sortOrder, setSortOrder] = useState('asc');

  // フィルターされた施策を取得
  const getFilteredImprovements = () => {
    return improvements.filter(improvement => {
      // 検索条件
      const matchesSearch = 
        improvement.title.toLowerCase().includes(search.toLowerCase()) ||
        improvement.category.toLowerCase().includes(search.toLowerCase());
      
      // カテゴリーフィルター
      const matchesCategory = categoryFilter ? improvement.category === categoryFilter : true;
      
      // 担当者フィルター
      const matchesResponsible = responsibleFilter ? improvement.responsible === responsibleFilter : true;
      
      // タブフィルター
      const matchesTab = selectedTab === 'すべて' ? true : 
                        (selectedTab === '以下の条件で絞り込む' && (search || categoryFilter || responsibleFilter)) ? true : 
                        false;
      
      return matchesSearch && matchesCategory && matchesResponsible && matchesTab;
    });
  };

  // ステータス別にフィルターされた施策を取得
  const getImprovementsByStatus = (status) => {
    return getFilteredImprovements()
      .filter(item => item.status === status)
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.id - b.id;
        } else {
          return b.id - a.id;
        }
      });
  };

  // 施策を削除する関数
  const deleteImprovement = (id) => {
    setImprovements(improvements.filter(item => item.id !== id));
  };

  // 施策をドラッグする関数
  const onDragStart = (e, id) => {
    e.dataTransfer.setData('id', id);
  };

  // ドロップを受け入れる関数
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // 施策をドロップする関数
  const onDrop = (e, status) => {
    const id = e.dataTransfer.getData('id');
    setImprovements(improvements.map(item => {
      if (item.id === parseInt(id)) {
        return { ...item, status };
      }
      return item;
    }));
  };

  // ユニークなカテゴリーと担当者を取得
  const categories = [...new Set(improvements.map(item => item.category))];
  const responsibles = [...new Set(improvements.map(item => item.responsible))];

  // 施策登録ページへの遷移処理
  const handleRegisterClick = () => {
    router.push('/manager/measures_register');
  };

  // カードの背景色をステータスによって変える
  const getCardColor = (status) => {
    switch(status) {
      case '計画中': return 'border-l-4 border-l-brand-cyan border-t border-r border-b border-gray-200 bg-white';
      case '実行中': return 'border-l-4 border-l-brand-teal border-t border-r border-b border-gray-200 bg-white';
      case '仕組み化': return 'border-l-4 border-l-brand-orange border-t border-r border-b border-gray-200 bg-white';
      case 'アーカイブ': return 'border-l-4 border-l-brand-darkBlue border-t border-r border-b border-gray-200 bg-white';
      default: return '';
    }
  };

  // カラム全体の背景色をグレーに統一
  const getColumnBgColor = (statusId) => {
    return 'bg-gray-200';
  };

  // 組織名を表示用にフォーマット
  const formatOrgName = (orgId) => {
    return `組織${orgId}`;
  };

  return (
    <div className='mt-4'>
      <h1 className="text-2xl font-bold ml-6 mb-2 text-brand-darkBlue">{formatOrgName(selectedOrganization)}の施策一覧</h1>
      <div className="p-6 text-black bg-white rounded-lg mx-6 min-h-1/2">
        {/* フィルター */}
        <div className="bg-brand-lightGray p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="施策名・カテゴリーで検索"
              className="border rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
      
            <select
              className="border rounded-md p-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-brand-teal"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">カテゴリー: すべて</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
      
            <select
              className="border rounded-md p-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-brand-teal"
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
            >
              <option value="">担当者: すべて</option>
              {responsibles.map(responsible => (
                <option key={responsible} value={responsible}>{responsible}</option>
              ))}
            </select>
      
            <div className="flex items-center ml-auto gap-4">
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">作成日時：</span>
                <select
                  className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">昇順▲</option>
                  <option value="desc">降順▼</option>
                </select>
              </div>
              <button className="bg-brand-lightGray border rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-teal">
                新しいビューとして保存
              </button>
            </div>
          </div>
        </div>
      
        {/* Kanbanボード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <div 
              key={status.id} 
              className={`rounded-lg shadow-sm overflow-hidden ${getColumnBgColor(status.id)}`}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, status.name)}
            >
              <div className={`p-3 text-white font-medium ${status.color}`}>
                <div className="flex justify-between items-center">
                  <span>{status.name}</span>
                  <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full">
                    {getImprovementsByStatus(status.name).length}
                  </span>
                </div>
              </div>
              <div className="p-3 max-h-screen overflow-y-auto">
                {getImprovementsByStatus(status.name).length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    施策なし
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getImprovementsByStatus(status.name).map(improvement => (
                      <div 
                        key={improvement.id} 
                        className={`p-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200 ${getCardColor(improvement.status)} cursor-pointer`}
                        draggable
                        onDragStart={(e) => onDragStart(e, improvement.id)}
                        onClick={() => openModal(improvement)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <div className="flex justify-between items-start w-full">
                              <h3 className="font-medium text-gray-800">{improvement.title}</h3>
                              <button 
                                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-brand-coral transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-coral"
                                onClick={(e) => {
                                  e.stopPropagation(); // モーダルが開かないようにイベント伝播を止める
                                  deleteImprovement(improvement.id);
                                }}
                                title="削除"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              <div className="flex items-center">
                                <span className="w-24">施策</span>
                                <span>{improvement.title}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-24">カテゴリ</span>
                                <span className="px-2 py-1 bg-brand-lightGray rounded-md text-xs">{improvement.category}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-24">責任者</span>
                                <span className="flex items-center">
                                  <span className=" w-6 h-6 rounded-full bg-brand-teal bg-opacity-20 text-brand-teal text-xs flex items-center justify-center mr-1">
                                    {improvement.responsible?.charAt(0) || '-'}
                                  </span>
                                  {improvement.responsible}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      
        {/* 新規施策登録ボタン - 親コンポーネントからの制御が可能 */}
        {showRegisterButton && (
          <div className="mt-8 flex justify-center">
            <button 
              className="bg-brand-cyan hover:bg-brand-teal text-white py-3 px-6 rounded-md text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2"
              onClick={handleRegisterClick}
            >
              新しい施策を登録する
            </button>
          </div>
        )}
      </div>
      
      {/* 施策詳細モーダル */}
      <MeasureModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        measure={selectedMeasure}
      />
    </div>
  );
}

export default ImprovementKanban;