// front/src/pages/personnel/organization_members_edit.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PersonnelHeader from "@/components/personnel/PersonnelHeader";
import PersonnelSubHeader from "@/components/common/SubHeader";
import MemberTabs from "@/components/personnel/MemberTabs";

const OrganizationMembersEditPage = () => {
  const router = useRouter();
  const { tab = 'employee' } = router.query;
  const [members, setMembers] = useState([]);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvError, setCsvError] = useState('');

  useEffect(() => {
    // タブに応じて初期データを設定
    if (router.isReady) {
      if (tab === 'manager') {
        setMembers([{ id: Date.now(), role: '人事部長', email: 'jinji@example.com', permission: '人事', orgCode: '', subOrgCode: '' }]);
      } else {
        setMembers([{ id: Date.now(), email: 'employee@example.com', permission: '一般', orgCode: '', subOrgCode: '' }]);
      }
    }
  }, [router.isReady, tab]);

  const addMember = () => {
    if (tab === 'manager') {
      setMembers([...members, { id: Date.now(), role: '', email: '', permission: '一般', orgCode: '', subOrgCode: '' }]);
    } else {
      setMembers([...members, { id: Date.now(), email: '', permission: '一般', orgCode: '', subOrgCode: '' }]);
    }
  };

  const updateMember = (id, field, value) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const deleteMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const handleCancel = () => {
    router.push('/personnel/organization_members?tab=' + tab);
  };

  const handleSave = () => {
    // ここでAPIを呼び出してデータを保存
    console.log('保存するメンバー:', members);
    alert('メンバー情報を保存しました');
    router.push('/personnel/organization_members?tab=' + tab);
  };

  const handleCSVUpload = () => {
    setShowCSVModal(true);
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setCsvError('');
  };

  const processCSV = () => {
    if (!csvFile) {
      setCsvError('ファイルを選択してください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // CSVのヘッダーを確認
        const requiredHeaders = ['email', 'permission', 'organization_code'];
        if (tab === 'manager') {
          requiredHeaders.push('role');
        }
        
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          setCsvError(`必須ヘッダーが不足しています: ${missingHeaders.join(', ')}`);
          return;
        }

        // CSVデータを処理
        const newMembers = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // 空行をスキップ
          
          const values = lines[i].split(',').map(v => v.trim());
          const member = {
            id: Date.now() + i,
            email: '',
            permission: '一般',
            orgCode: '',
            subOrgCode: ''
          };
          
          // 管理職の場合は役職フィールドを追加
          if (tab === 'manager') {
            member.role = '';
          }

          // 各カラムの値を設定
          headers.forEach((header, index) => {
            if (header === 'email') member.email = values[index] || '';
            if (header === 'permission') member.permission = values[index] || '一般';
            if (header === 'organization_code') member.orgCode = values[index] || '';
            if (header === 'sub_organization_code') member.subOrgCode = values[index] || '';
            if (tab === 'manager' && header === 'role') member.role = values[index] || '';
          });

          // 必須項目のチェック
          if (member.email && member.orgCode) {
            if (tab === 'manager' && !member.role) {
              continue; // 管理職の場合は役職名が必須
            }
            newMembers.push(member);
          }
        }

        if (newMembers.length === 0) {
          setCsvError('有効なデータがありません');
          return;
        }

        // 既存のメンバーと新しいメンバーを結合
        setMembers([...members, ...newMembers]);
        setShowCSVModal(false);
        setCsvFile(null);
      } catch (error) {
        setCsvError('CSVの解析中にエラーが発生しました: ' + error.message);
      }
    };

    reader.onerror = () => {
      setCsvError('ファイルの読み込み中にエラーが発生しました');
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
      <PersonnelHeader />

      {/* サブヘッダー */}
      <PersonnelSubHeader title="組織メンバー" />

      {/* タブ */}
      <MemberTabs activeTab={tab} />

      {/* 全体のコンテナ（背景グレー） */}
      <div className="flex-1 bg-brand-lightGray p-6 overflow-auto">
        {/* コントロールバー */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={handleCancel} 
              className="flex items-center text-brand-darkBlue hover:text-brand-teal"
            >
              <span className="mr-2">←</span> 編集をやめる
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCSVUpload}
              className="border border-brand-cyan text-brand-cyan px-4 py-2 rounded hover:bg-brand-lightGray"
            >
              CSVで{tab === 'manager' ? '管理職' : '従業員'}を追加
            </button>
            <button 
              onClick={handleSave}
              className="bg-brand-cyan text-white px-4 py-2 rounded hover:bg-brand-teal"
            >
              保存
            </button>
          </div>
        </div>

        {/* メンバーフォーム */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className={`grid ${tab === 'manager' ? 'grid-cols-5' : 'grid-cols-4'} gap-4 mb-4 text-sm font-medium text-gray-700`}>
            {tab === 'manager' && <div>役職名</div>}
            <div>メールアドレス</div>
            <div>権限</div>
            <div>所属組織コード</div>
            <div className="flex-1">準所属組織コード</div>
          </div>

          {members.map((member, index) => (
            <div key={member.id} className={`grid ${tab === 'manager' ? 'grid-cols-5' : 'grid-cols-4'} gap-4 mb-4 items-center`}>
              {tab === 'manager' && (
                <input
                  type="text"
                  value={member.role || ''}
                  onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                  placeholder="例: 営業部長"
                  className="border text-black rounded p-2 w-full text-sm"
                />
              )}
              <input
                type="email"
                value={member.email || ''}
                onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                placeholder="例: employee@example.com"
                className="border text-black rounded p-2 w-full text-sm"
              />
              <select
                value={member.permission || '一般'}
                onChange={(e) => updateMember(member.id, 'permission', e.target.value)}
                className="border text-black rounded p-2 w-full text-sm appearance-none"
              >
                <option value="人事">人事</option>
                <option value="一般">一般</option>
              </select>
              <select
                value={member.orgCode || ''}
                onChange={(e) => updateMember(member.id, 'orgCode', e.target.value)}
                className="border text-black rounded p-2 w-full text-sm appearance-none"
              >
                <option value="">選択してください</option>
                <option value="0001">0001</option>
                <option value="0002">0002</option>
              </select>
              <div className="flex items-center justify-between">
                <select
                  value={member.subOrgCode || ''}
                  onChange={(e) => updateMember(member.id, 'subOrgCode', e.target.value)}
                  className="border text-black rounded p-2 w-full text-sm appearance-none"
                >
                  <option value="">選択してください</option>
                  <option value="0001">0001</option>
                  <option value="0002">0002</option>
                </select>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="text-red-500 hover:text-red-700 ml-2 px-3 whitespace-nowrap"
                >
                  削除
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addMember}
            className="text-brand-cyan border border-brand-cyan px-4 py-2 rounded hover:bg-brand-lightGray mt-4 text-sm"
          >
            {tab === 'manager' ? '管理職を追加' : '従業員を追加'}
          </button>
        </div>
      </div>

      {/* CSV アップロードモーダル */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-brand-darkBlue">CSVで{tab === 'manager' ? '管理職' : '従業員'}を追加</h3>
              <button onClick={() => setShowCSVModal(false)} className="text-brand-darkBlue hover:text-brand-teal">
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                以下のカラムを含むCSVファイルをアップロードしてください：
              </p>
              <ul className="text-xs text-gray-600 list-disc pl-5 mb-4">
                {tab === 'manager' && <li>role (役職名) - 必須</li>}
                <li>email (メールアドレス) - 必須</li>
                <li>permission (権限) - 必須</li>
                <li>organization_code (所属組織コード) - 必須</li>
                <li>sub_organization_code (準所属組織コード) - 省略可</li>
              </ul>
              <p className="text-xs text-gray-600 mb-2">
                ※ 準所属組織コードは空白でも問題ありません。
              </p>
              
              <div className="mt-4">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-lightGray file:text-brand-darkBlue
                  hover:file:bg-gray-200"
                />
              </div>
              
              {csvError && (
                <div className="mt-2 text-red-500 text-xs">
                  {csvError}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCSVModal(false)}
                className="border border-brand-darkBlue text-brand-darkBlue px-4 py-2 rounded w-full hover:bg-brand-lightGray"
              >
                キャンセル
              </button>
              <button 
                onClick={processCSV}
                className="bg-brand-cyan text-white px-4 py-2 rounded w-full hover:bg-brand-teal"
              >
                アップロード
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationMembersEditPage;