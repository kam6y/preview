// front/src/pages/personnel/organization_structure.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PersonnelHeader from "@/components/personnel/PersonnelHeader";
import PersonnelSubHeader from "@/components/common/SubHeader";

// クライアントサイドでのみ読み込むコンポーネント
const OrganizationChart = dynamic(() => import('../../components/personnel/OrganizationChart'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-64">読み込み中...</div>
});

export default function OrganizationStructurePage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([
    {
      id: 1,
      name: '本社',
      code: '0001',
      startDate: '2024/04/01',
      children: [
        {
          id: 2,
          name: '人事部',
          code: '0002',
          startDate: '2024/04/01',
          children: []
        }
      ]
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024/04/01');
  const [hasOrganization, setHasOrganization] = useState(true);
  const [dates, setDates] = useState(['2024/04/01']);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // モーダル表示の切り替え
  const handleAddHistoryClick = () => {
    setShowAddModal(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  // 履歴日付の追加
  const handleAddDate = () => {
    if (startDate) {
      setSelectedDate(startDate);
      setDates([...dates, startDate].sort());
      setShowAddModal(false);
      setHasOrganization(true); // 新しい日付が追加されたら組織を表示
    }
  };

  // 編集ページへ遷移し、現在の組織データを渡す
  const handleEditClick = () => {
    // 現在の組織データと選択日付をクエリパラメータとしてシリアライズ
    router.push({
      pathname: '/personnel/organization_structure_register',
      query: { 
        date: selectedDate,
        data: JSON.stringify(organizations)
      }
    });
  };

  // 組織データの削除
  const handleDeleteClick = () => {
    if (confirm('この日付の組織構造を削除してよろしいですか？')) {
      // 選択された日付を削除
      const newDates = dates.filter(date => date !== selectedDate);
      setDates(newDates);
      
      // 選択された日付が削除された場合、別の日付を選択
      if (newDates.length > 0) {
        setSelectedDate(newDates[0]);
      } else {
        setSelectedDate('');
        setHasOrganization(false);
      }
    }
  };

  // 日付選択の処理
  const handleDateClick = (date) => {
    setSelectedDate(date);
    // 実際のアプリでは、この日付に対応する組織データをAPIから取得する処理が必要
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <PersonnelHeader />

      {/* サブヘッダー */}
      <PersonnelSubHeader title="組織構造" />

      {/* メインコンテンツ */}
      <div className="flex flex-1 bg-brand-lightGray">
        {/* サイドバー */}
        <div className="w-64 p-4">
          <button 
            onClick={handleAddHistoryClick}
            className="border border-brand-cyan text-brand-cyan px-4 py-2 rounded hover:bg-brand-lightGray mb-4 w-full text-center"
          >
            履歴を追加
          </button>
          
          <div className="mt-4">
            {dates.map(date => (
              <div key={date} className="mt-2">
                <button 
                  onClick={() => handleDateClick(date)}
                  className={`block text-left px-2 py-1 rounded w-full ${
                    selectedDate === date 
                      ? 'bg-brand-cyan text-white' 
                      : 'text-brand-darkBlue hover:bg-brand-lightGray'
                  }`}
                >
                  {date}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* メインエリア */}
        <div className="flex-1 p-4">
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[80vh]">
            {hasOrganization ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-brand-darkBlue">適用開始日: {selectedDate}</div>
                  <div>
                    <button 
                      onClick={handleEditClick}
                      className="text-brand-cyan border border-brand-cyan rounded px-4 py-1 mr-2 hover:bg-brand-lightGray"
                    >
                      編集
                    </button>
                    <button 
                      onClick={handleDeleteClick}
                      className="text-brand-coral hover:text-brand-coral"
                    >
                      削除
                    </button>
                  </div>
                </div>

                {/* 組織図 */}
                <div className="flex justify-center items-center mt-8 overflow-auto h-[calc(100vh-240px)]">
                  {isMounted && organizations.length > 0 ? (
                    <div className="flex flex-row justify-center w-full" style={{ paddingBottom: '100px', paddingLeft: '50px', paddingRight: '50px' }}>
                      <OrganizationChart 
                        organizations={organizations}
                        onAddChild={() => {}} // 閲覧モードでは編集不可
                        onDeleteOrg={() => {}} // 閲覧モードでは削除不可
                        readOnly={true} // 閲覧モードを明示的に指定
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-brand-darkBlue">
                      読み込み中...
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-center py-8 text-brand-darkBlue text-xl">
                  組織がありません
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 履歴追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-brand-darkBlue">履歴を追加</h3>
              <button onClick={handleCloseModal} className="text-brand-darkBlue hover:text-brand-teal">
                ✕
              </button>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-brand-darkBlue">適用開始日</label>
              <input 
                type="date" 
                className="border rounded p-2 w-full text-brand-darkBlue"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
                  setStartDate(formattedDate);
                }}
              />
            </div>
            <button 
              onClick={handleAddDate}
              className="bg-brand-cyan text-white px-4 py-2 rounded w-full hover:bg-brand-teal"
            >
              追加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}