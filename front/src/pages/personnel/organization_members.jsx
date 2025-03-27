// front/src/pages/personnel/organization_members.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PersonnelHeader from "@/components/personnel/PersonnelHeader";
import PersonnelSubHeader from "@/components/common/SubHeader";
import MemberTabs from "@/components/personnel/MemberTabs";

const OrganizationMembersPage = () => {
  const router = useRouter();
  const { tab = 'manager' } = router.query;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ページネーション用の状態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // ページ切り替え時に常に1ページ目に戻す
    setCurrentPage(1);
    
    // 仮データを提供する関数
    const fetchDummyData = () => {
      setLoading(true);
      
      // 仮のデータ
      let dummyData = [];
      
      if (tab === 'manager') {
        // 管理職のダミーデータ
        dummyData = [
          { id: 1, role: '取締役', email: 'director@example.com', permission: '経営者', orgCode: '0001', orgName: '本社', subOrgCode: '', subOrgName: '' },
          { id: 2, role: '営業部長', email: 'sales-manager@example.com', permission: '一般', orgCode: '0002', orgName: '営業部', subOrgCode: '', subOrgName: '' },
          { id: 3, role: '開発部長', email: 'dev-manager@example.com', permission: '一般', orgCode: '0003', orgName: '開発部', subOrgCode: '', subOrgName: '' },
          { id: 4, role: '人事部長', email: 'hr-manager@example.com', permission: '人事', orgCode: '0004', orgName: '人事部', subOrgCode: '', subOrgName: '' },
          // ページネーションテスト用に追加データ
          { id: 10, role: '財務部長', email: 'finance-manager@example.com', permission: '一般', orgCode: '0005', orgName: '財務部', subOrgCode: '', subOrgName: '' },
          { id: 11, role: '法務部長', email: 'legal-manager@example.com', permission: '一般', orgCode: '0006', orgName: '法務部', subOrgCode: '', subOrgName: '' },
          { id: 12, role: 'マーケティング部長', email: 'marketing-manager@example.com', permission: '一般', orgCode: '0007', orgName: 'マーケティング部', subOrgCode: '', subOrgName: '' },
        ];
      } else {
        // 従業員のダミーデータ
        dummyData = [
          { id: 5, email: 'sales1@example.com', permission: '一般', orgCode: '0002', orgName: '営業部', subOrgCode: '', subOrgName: '' },
          { id: 6, email: 'sales2@example.com', permission: '一般', orgCode: '0002', orgName: '営業部', subOrgCode: '', subOrgName: '' },
          { id: 7, email: 'dev1@example.com', permission: '一般', orgCode: '0003', orgName: '開発部', subOrgCode: '', subOrgName: '' },
          { id: 8, email: 'dev2@example.com', permission: '一般', orgCode: '0003', orgName: '開発部', subOrgCode: '0002', subOrgName: '営業部' },
          { id: 9, email: 'hr1@example.com', permission: '人事', orgCode: '0004', orgName: '人事部', subOrgCode: '', subOrgName: '' },
          // ページネーションテスト用に追加データ
          { id: 13, email: 'finance1@example.com', permission: '一般', orgCode: '0005', orgName: '財務部', subOrgCode: '', subOrgName: '' },
          { id: 14, email: 'finance2@example.com', permission: '一般', orgCode: '0005', orgName: '財務部', subOrgCode: '', subOrgName: '' },
          { id: 15, email: 'legal1@example.com', permission: '一般', orgCode: '0006', orgName: '法務部', subOrgCode: '', subOrgName: '' },
          { id: 16, email: 'marketing1@example.com', permission: '一般', orgCode: '0007', orgName: 'マーケティング部', subOrgCode: '', subOrgName: '' },
          { id: 17, email: 'marketing2@example.com', permission: '一般', orgCode: '0007', orgName: 'マーケティング部', subOrgCode: '', subOrgName: '' },
          { id: 18, email: 'marketing3@example.com', permission: '一般', orgCode: '0007', orgName: 'マーケティング部', subOrgCode: '', subOrgName: '' },
        ];
      }
      
      setMembers(dummyData);
      
      // 総ページ数を計算
      setTotalPages(Math.ceil(dummyData.length / itemsPerPage));
      setLoading(false);
    };

    if (router.isReady) {
      fetchDummyData();
    }
  }, [router.isReady, tab, itemsPerPage]);

  // 現在のページのデータのみを取得
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return members.slice(startIndex, endIndex);
  };

  // ページを変更する関数
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 表示件数を変更する関数
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // 表示件数変更時は1ページ目に戻す
  };

  const handleEdit = () => {
    router.push('/personnel/organization_members_edit?tab=' + tab);
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
        {/* メンバーリスト（カード風） */}
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-240px)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-brand-darkBlue">
              {tab === 'manager' ? '管理職一覧' : '従業員一覧'}
            </h2>
            <button
              onClick={handleEdit}
              className="bg-brand-cyan text-white px-4 py-2 rounded hover:bg-brand-teal"
            >
              編集
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              読み込み中...
            </div>
          ) : members.length > 0 ? (
            <>
              {/* 表示件数選択 */}
              <div className="flex justify-end mb-4">
                <div className="flex text-black items-center text-sm">
                  <span className="mr-2">表示件数:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border rounded p-1"
                  >
                    <option value={5}>5件</option>
                    <option value={10}>10件</option>
                    <option value={20}>20件</option>
                  </select>
                </div>
              </div>

              {/* テーブル */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      {tab === 'manager' && (
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          役職
                        </th>
                      )}
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        メールアドレス
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        権限
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        所属組織
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        準所属組織
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getCurrentPageData().map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        {tab === 'manager' && (
                          <td className="py-2 px-4 text-sm text-gray-900">
                            {member.role}
                          </td>
                        )}
                        <td className="py-2 px-4 text-sm text-gray-900">
                          {member.email}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-900">
                          {member.permission}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-900">
                          {member.orgCode} {member.orgName && `(${member.orgName})`}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-900">
                          {member.subOrgCode} {member.subOrgName && `(${member.subOrgName})`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-1">
                    {/* 前へボタン */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-brand-darkBlue hover:bg-brand-lightGray'
                      }`}
                    >
                      前へ
                    </button>

                    {/* ページ番号 */}
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      // 現在のページの前後2ページずつと最初・最後のページを表示
                      const shouldShowPage =
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - currentPage) <= 2;

                      // 省略記号の表示条件
                      const showEllipsisBefore =
                        index === 1 && currentPage > 4;
                      const showEllipsisAfter =
                        index === totalPages - 2 && currentPage < totalPages - 3;

                      if (showEllipsisBefore) {
                        return <span key={`ellipsis-before`}>...</span>;
                      }

                      if (showEllipsisAfter) {
                        return <span key={`ellipsis-after`}>...</span>;
                      }

                      if (shouldShowPage) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNumber
                                ? 'bg-brand-darkBlue text-white'
                                : 'text-brand-darkBlue hover:bg-brand-lightGray'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }

                      return null;
                    })}

                    {/* 次へボタン */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-brand-darkBlue hover:bg-brand-lightGray'
                      }`}
                    >
                      次へ
                    </button>
                  </div>
                </div>
              )}

              {/* 表示件数情報 */}
              <div className="mt-4 text-sm text-gray-600 text-center">
                全{members.length}件中 {(currentPage - 1) * itemsPerPage + 1}～
                {Math.min(currentPage * itemsPerPage, members.length)}件表示
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              {tab === 'manager' ? '管理職がいません' : '従業員がいません'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationMembersPage;