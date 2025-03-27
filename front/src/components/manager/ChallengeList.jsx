// components/manager/ChallengeList.jsx
import React, { useState, useEffect } from 'react';

const ChallengeList = ({ challenges: initialChallenges, categories }) => {
  // 状態管理
  const [challenges, setChallenges] = useState(initialChallenges);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [challengeText, setChallengeText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [deletingChallenge, setDeletingChallenge] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState("");

  // 初期データが変更された場合に状態を更新
  useEffect(() => {
    setChallenges(initialChallenges);
  }, [initialChallenges]);

  // 編集モーダルを表示
  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setShowEditModal(true);
  };

  // 削除モーダルを表示
  const handleDelete = (challenge) => {
    setDeletingChallenge(challenge);
    setShowDeleteModal(true);
  };

  // 編集を確定
  const confirmEdit = () => {
    if (!editingChallenge.category || !editingChallenge.challenge) {
      alert("カテゴリーと課題内容を入力してください");
      return;
    }

    setChallenges(prev => 
      prev.map(item => 
        item.id === editingChallenge.id ? editingChallenge : item
      )
    );
    
    setShowEditModal(false);
    setEditingChallenge(null);
  };

  // 削除を確定
  const confirmDelete = () => {
    setChallenges(prev => 
      prev.filter(item => item.id !== deletingChallenge.id)
    );
    
    setShowDeleteModal(false);
    setDeletingChallenge(null);
  };

  // 新規課題を登録
  const handleRegister = () => {
    if (!selectedCategory || !challengeText) {
      alert("カテゴリーと課題内容を入力してください");
      return;
    }
    
    // 選択されたカテゴリー名を取得
    const categoryObj = categories.find(cat => cat.id === selectedCategory);
    const categoryName = categoryObj ? categoryObj.name : "";
    
    // 新しい課題を作成
    const newChallenge = {
      id: Date.now(),  // 一時的なIDとして現在のタイムスタンプを使用
      category: categoryName,
      challenge: challengeText,
      measureCount: 0  // 新規登録なので施策数は0
    };
    
    // 課題リストに追加
    setChallenges(prev => [...prev, newChallenge]);
    
    // 入力フィールドをリセット
    setSelectedCategory("");
    setChallengeText("");
  };

  // フィルタリングされた課題リスト
  const filteredChallenges = filteredCategory 
    ? challenges.filter(item => item.category === filteredCategory)
    : challenges;

  return (
    <div className='m-4'>
      <h3 className="text-xl font-bold text-gray-900 mt-6">課題一覧・新規登録</h3>
      <div className="bg-white rounded-lg shadow-md p-4 mt-6">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="mr-2 text-sm font-medium text-gray-700">カテゴリーでフィルタ:</label>
            <select
              value={filteredCategory}
              onChange={(e) => setFilteredCategory(e.target.value)}
              className="border text-black border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">すべて表示</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <span className="text-sm text-gray-600">
            全{challenges.length}件中 {filteredChallenges.length}件表示
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-brand-teal text-white">
                <th className="px-6 py-3 text-left w-1/4">カテゴリー</th>
                <th className="px-6 py-3 text-left w-1/2">課題</th>
                <th className="px-6 py-3 text-center w-1/12">施策数</th>
                <th className="px-6 py-3 text-center w-1/6">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallenges.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    <div className="flex items-center">
                      <span>{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">{item.challenge}</td>
                  <td className="px-6 py-3 text-sm text-center text-gray-700">{item.measureCount}</td>
                  <td className="px-6 py-3 text-sm flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-brand-cyan hover:bg-brand-teal text-white px-4 py-1 rounded text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-500 hover:text-red-700 px-4 py-1 rounded text-sm"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
      
              {/* 新規登録フォーム行 */}
              <tr className="bg-gray-100">
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full text-gray-700"
                    >
                      <option value="">選択してください</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm">
                  <input
                    type="text"
                    value={challengeText}
                    onChange={(e) => setChallengeText(e.target.value)}
                    placeholder="自由記述"
                    className="border border-gray-300 rounded px-2 py-1 w-full text-gray-700"
                  />
                </td>
                <td className="px-6 py-3 text-sm text-center"></td>
                <td className="px-6 py-3 text-sm flex justify-center">
                  <button
                    onClick={handleRegister}
                    className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-1 rounded text-sm"
                  >
                    登録
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 編集モーダル */}
      {showEditModal && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-1/2 p-6">
            <h3 className="text-lg font-semibold mb-4">課題を編集</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">カテゴリー</label>
              <select
                value={categories.find(cat => cat.name === editingChallenge.category)?.id || ""}
                onChange={(e) => {
                  const categoryObj = categories.find(cat => cat.id === e.target.value);
                  setEditingChallenge({
                    ...editingChallenge,
                    category: categoryObj ? categoryObj.name : ""
                  });
                }}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="">選択してください</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">課題内容</label>
              <input
                type="text"
                value={editingChallenge.challenge}
                onChange={(e) => setEditingChallenge({
                  ...editingChallenge,
                  challenge: e.target.value
                })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                キャンセル
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-brand-teal text-white rounded hover:bg-brand-darkBlue"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-1/3 p-6">
            <h3 className="text-lg font-semibold mb-4">課題を削除</h3>
            
            <p className="mb-6">
              以下の課題を削除してもよろしいですか？
              <br />
              <span className="font-semibold">{deletingChallenge.challenge}</span>
            </p>
            
            {deletingChallenge.measureCount > 0 && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
                <p className="text-sm">
                  この課題には{deletingChallenge.measureCount}件の施策が登録されています。
                  削除すると、関連する施策も全て削除されます。
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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

export default ChallengeList;