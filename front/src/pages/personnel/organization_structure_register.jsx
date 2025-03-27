// front/src/pages/personnel/organization_structure_register.jsx
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

const OrganizationStructureRegisterPage = () => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024/04/01');
  const [hasOrganization, setHasOrganization] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [orgToDelete, setOrgToDelete] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '' });
  const [isMounted, setIsMounted] = useState(false);

  // ルーターから渡されたデータの取得
  useEffect(() => {
    setIsMounted(true);
    
    if (router.isReady) {
      // URLパラメータから日付を取得
      if (router.query.date) {
        setSelectedDate(router.query.date);
      }
      
      // URLパラメータから組織データを取得
      if (router.query.data) {
        try {
          const parsedData = JSON.parse(router.query.data);
          setOrganizations(parsedData);
          setHasOrganization(true);
        } catch (error) {
          console.error('Failed to parse organization data:', error);
          // 既存のデータがパースできない場合、デフォルトで空の状態から始める
        }
      }
    }
  }, [router.isReady, router.query]);

  // 組織ツリーから全ての組織コードを集める関数
  const getAllOrgCodes = (orgs) => {
    let codes = [];
    const traverse = (nodes) => {
      if (!nodes) return;
      nodes.forEach(node => {
        codes.push(node.code);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(orgs);
    return codes;
  };

  // 最大の組織コードを計算する関数
  const getNextOrgCode = () => {
    const allCodes = getAllOrgCodes(organizations);
    if (allCodes.length === 0) return '0001';
    
    // 先頭の0を保持したまま数値として処理
    const numericCodes = allCodes.map(code => parseInt(code, 10))
      .filter(num => !isNaN(num));
    
    if (numericCodes.length === 0) return '0001';
    
    const maxCode = Math.max(...numericCodes);
    const nextCode = (maxCode + 1).toString().padStart(4, '0');
    return nextCode;
  };

  // サンプル組織を追加
  const addSampleOrganizations = () => {
    const headOffice = {
      id: 1,
      name: '本社',
      code: '0001',
      startDate: selectedDate,
      children: []
    };
    
    setOrganizations([headOffice]);
    setHasOrganization(true);
  };

  // 組織追加ボタンのハンドラ
  const handleAddOrgClick = (parent = null) => {
    setSelectedParent(parent);
    const nextCode = getNextOrgCode();
    setFormData({ code: nextCode, name: '' });
    setShowAddOrgModal(true);
  };
  
  // 組織削除ボタンのハンドラ
  const handleDeleteOrgClick = (org) => {
    setOrgToDelete(org);
    setShowDeleteModal(true);
  };

  // 組織追加の処理
  const handleAddOrg = () => {
    if (!formData.code || !formData.name) return;

    const newOrg = {
      id: Date.now(),
      name: formData.name,
      code: formData.code,
      startDate: selectedDate,
      children: []
    };

    if (selectedParent) {
      // 既存組織の子として追加
      const addChildToParent = (orgs) => {
        return orgs.map(org => {
          if (org.id === selectedParent.id) {
            return { ...org, children: [...org.children, newOrg] };
          } else if (org.children && org.children.length > 0) {
            return { ...org, children: addChildToParent(org.children) };
          }
          return org;
        });
      };
      
      setOrganizations(addChildToParent([...organizations]));
    } else {
      // ルート組織として追加
      setOrganizations([...organizations, newOrg]);
    }

    setShowAddOrgModal(false);
    setHasOrganization(true);
  };
  
  // 組織削除の処理
  const handleDeleteOrg = () => {
    if (!orgToDelete) return;
    
    // ルートレベルの組織を削除する場合
    if (!selectedParent) {
      setOrganizations(organizations.filter(org => org.id !== orgToDelete.id));
      
      // 組織が全て削除された場合、hasOrganizationをfalseに設定
      if (organizations.length === 1) {
        setHasOrganization(false);
      }
    } else {
      // 子組織を削除する場合は、親組織の子リストから削除
      const removeOrgFromTree = (orgs) => {
        return orgs.map(org => {
          // 直接の子を確認
          if (org.children && org.children.some(child => child.id === orgToDelete.id)) {
            return {
              ...org,
              children: org.children.filter(child => child.id !== orgToDelete.id)
            };
          } 
          // 深い階層を確認
          else if (org.children && org.children.length > 0) {
            return {
              ...org,
              children: removeOrgFromTree(org.children)
            };
          }
          return org;
        });
      };
      
      setOrganizations(removeOrgFromTree([...organizations]));
    }
    
    setShowDeleteModal(false);
    setOrgToDelete(null);
  };

  // 保存処理
  const handleSave = () => {
    console.log('組織構造を保存:', {
      date: selectedDate,
      organizations
    });
    
    // ここでAPIリクエストを送信するなどの処理
    
    // 保存成功メッセージ
    alert('組織構造を保存しました');
    
    // 組織構造ページに戻る時にデータを渡す
    router.push({
      pathname: '/personnel/organization_structure',
      query: { 
        savedData: JSON.stringify(organizations),
        savedDate: selectedDate
      }
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <PersonnelHeader />

      {/* サブヘッダー */}
      <PersonnelSubHeader title="組織構造" />

      {/* 全体のコンテナ（背景グレー） */}
      <div className="flex-1 bg-brand-lightGray p-6 overflow-auto">
        {/* コントロールバー（カード風） */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/personnel/organization_structure')} 
              className="flex items-center text-brand-darkBlue hover:text-brand-teal"
            >
              <span className="mr-2">←</span> 作成をやめる
            </button>
          </div>
          <div className="flex items-center">
            <div className="text-brand-darkBlue mr-4">適用開始日: {selectedDate}</div>
            <button 
              onClick={handleSave}
              className="bg-brand-cyan text-white px-4 py-2 rounded hover:bg-brand-teal"
              disabled={!hasOrganization}
            >
              保存
            </button>
          </div>
        </div>

        {/* 組織図エリア（カード風） */}
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-240px)] overflow-hidden">
          {/* スクロール領域を広くして、すべての組織が表示されるようにする */}
          <div className="overflow-auto h-full" style={{ paddingBottom: '100px', paddingLeft: '50px', paddingRight: '50px' }}>
            {isMounted ? (
              hasOrganization ? (
                <OrganizationChart 
                  organizations={organizations}
                  onAddChild={handleAddOrgClick}
                  onDeleteOrg={handleDeleteOrgClick}
                />
              ) : (
                <div className="flex flex-col justify-center items-center h-64 gap-4 mt-24">
                  <button 
                    onClick={() => handleAddOrgClick()}
                    className="text-4xl text-gray-500 hover:text-brand-darkBlue w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={addSampleOrganizations}
                    className="text-brand-cyan border border-brand-cyan px-4 py-2 rounded hover:bg-brand-lightGray"
                  >
                    サンプル組織を追加
                  </button>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-64">読み込み中...</div>
            )}
          </div>
        </div>
      </div>

      {/* 組織追加モーダル */}
      {showAddOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-brand-darkBlue">組織を追加</h3>
              <button onClick={() => setShowAddOrgModal(false)} className="text-brand-darkBlue hover:text-brand-teal">
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-brand-darkBlue">組織コード</label>
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="border rounded p-2 w-full text-brand-darkBlue"
                placeholder="例: 0002"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-brand-darkBlue">組織名</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border rounded p-2 w-full text-brand-darkBlue"
                placeholder="例: 人事部"
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-brand-darkBlue">上位組織</label>
              <input 
                type="text" 
                value={selectedParent ? selectedParent.name : 'なし'}
                className="border rounded p-2 w-full text-brand-darkBlue bg-brand-lightGray"
                disabled
              />
            </div>
            
            <button 
              onClick={handleAddOrg}
              className="bg-brand-cyan text-white px-4 py-2 rounded w-full hover:bg-brand-teal"
            >
              追加
            </button>
          </div>
        </div>
      )}
      
      {/* 組織削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-brand-darkBlue">組織の削除</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-brand-darkBlue hover:text-brand-teal">
                ✕
              </button>
            </div>
            <div className="mb-6">
              <p className="text-brand-darkBlue mb-2">
                この組織を削除してよろしいですか？
              </p>
              <p className="text-brand-coral mb-2 font-bold">
                {orgToDelete?.name} (コード: {orgToDelete?.code})
              </p>
              {orgToDelete?.children && orgToDelete.children.length > 0 && (
                <p className="text-brand-coral text-sm">
                  警告: 子組織も全て削除されます
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="border border-brand-darkBlue text-brand-darkBlue px-4 py-2 rounded w-full hover:bg-brand-lightGray"
              >
                キャンセル
              </button>
              <button 
                onClick={handleDeleteOrg}
                className="bg-brand-coral text-white px-4 py-2 rounded w-full hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationStructureRegisterPage;