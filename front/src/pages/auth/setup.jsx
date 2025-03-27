import { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import Image from "next/image";

export default function SetupPage() {
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 名前が入力された後の処理をここに書く（API通信やルーティングなど）
    console.log("ユーザー名:", userName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Auth専用ヘッダー */}
      <AuthHeader />

      {/* メインコンテンツ */}
      <main className="w-full flex-1 flex justify-center items-center p-6">
        {/* カードコンテナ */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg py-24 w-svw max-w-5xl flex flex-col justify-center items-center md:flex-row">
          {/* フォーム */}
          <div className="w-full md:w-1/2 pl-0 md:pl-16">
            <h2 className="text-3xl font-extrabold text-brand-darkBlue text-center mb-4">
              はじめまして！
            </h2>
            <h2 className="text-3xl font-extrabold text-brand-darkBlue text-center mb-4">
              Motivaにようこそ!
            </h2>
            <p className="text-center text-gray-600 mb-8">
              最初にあなたのお名前を教えてください
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label className="block mb-2 font-semibold text-gray-700">
                  お名前
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-black w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors duration-200"
                  placeholder="例: 田中 太郎"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-cyan hover:bg-brand-darkBlue text-white font-semibold py-3 mt-12 rounded-lg transition-all duration-200 shadow-md"
              >
                次へ
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}