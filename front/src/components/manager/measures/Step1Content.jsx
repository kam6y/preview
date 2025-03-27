import React from 'react';

const Step1Content = ({
  selectedCategory,
  setSelectedCategory,
  selectedKadai,
  setSelectedKadai,
  handleKadaiChange,
  handleNext,
  canGoNext,
  categories,
  categoryIssues = {},
}) => {
  const issuesForSelectedCategory = selectedCategory
    ? categoryIssues[selectedCategory] || []
    : [];

  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold text-brand-teal mb-4">
        解決したい課題を教えてください（複数選択可）
      </h2>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          課題カテゴリー
        </label>
        <select
          className="border text-white bg-brand-teal border-brand-darkBlue rounded px-3 py-2 w-full md:w-1/2"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedKadai([]);
          }}
        >
          <option value="">-- カテゴリーを選択 --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">課題</label>
        <div className="flex flex-col gap-2">
          {!selectedCategory ? (
            <p className="text-sm text-gray-500">
              カテゴリーを選択してください
            </p>
          ) : issuesForSelectedCategory.length > 0 ? (
            issuesForSelectedCategory.map((k) => (
              <label key={k} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-brand-teal"
                  checked={selectedKadai.includes(k)}
                  onChange={() => handleKadaiChange(k)}
                />
                {k}
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              選択されたカテゴリーに課題が登録されていません
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!canGoNext()}
          className={`px-6 py-2 rounded text-white font-semibold transition-colors ${
            canGoNext()
              ? 'bg-brand-orange hover:bg-brand-coral'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default Step1Content;