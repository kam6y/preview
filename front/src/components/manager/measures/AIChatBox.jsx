// front/src/components/manager/measures/AIChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import TooltipBubble from './TooltipBubbleAI';

const AIChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  const chatEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  // スクロールを最新メッセージに合わせる
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // チャットを開閉した時にメインコンテンツを調整
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (isOpen) {
        // チャットが開いたらメインコンテンツを左にずらす
        mainContent.style.transform = 'translateX(-12.5%)';
        mainContent.style.width = '75%';
        mainContent.style.transition = 'all 0.3s ease-in-out';
        // チャットが開かれたらツールチップを非表示にする
        setShowTooltip(false);
      } else {
        // チャットが閉じたらメインコンテンツを元に戻す
        mainContent.style.transform = 'translateX(0)';
        mainContent.style.width = '100%';
      }
    }
  }, [isOpen]);

  // ツールチップ用のタイマー
  useEffect(() => {
    // 30秒後にツールチップを自動的に非表示にする
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 30000);

    return () => clearTimeout(tooltipTimer);
  }, []);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
    // ボタンをクリックしたらツールチップを非表示にする
    setShowTooltip(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // ユーザーメッセージを追加
    const userMessage = { text: inputText, isUser: true };
    setMessages([...messages, userMessage]);
    setInputText('');

    // AI応答のシミュレーション
    setTimeout(() => {
      const aiResponse = { text: `これは「${inputText}」への応答です。`, isUser: false };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const stepbarHeight = 48; // Stepbarの高さ（ピクセル）

  return (
    <>
      {/* 閉じた状態のボタン - 右下に円形ボタン */}
      {!isOpen && (
        <div className="fixed right-6 bottom-6 z-50">
          {showTooltip && (
            <TooltipBubble text="AIを活用して施策提案をサポートします!" />
          )}
          <button
            onClick={toggleChatBox}
            className="ai-chat-toggle-btn w-14 h-14 bg-brand-teal text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-cyan transition-all"
          >
            <span className="font-semibold text-lg">AI</span>
          </button>
        </div>
      )}

      {/* 開いた状態のチャットボックス */}
      {isOpen && (
        <div 
          className="fixed bottom-0 right-0 w-1/4 h-auto bg-white shadow-xl flex flex-col z-50" 
          style={{ top: `${stepbarHeight}px` }}
          ref={chatBoxRef}
        >
          {/* ヘッダー */}
          <div className="bg-brand-teal text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">AIアシスタント</h3>
            <button onClick={toggleChatBox} className="text-white hover:text-gray-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <p>質問を入力して会話を始めましょう</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.isUser
                      ? 'ml-auto bg-brand-cyan text-white'
                      : 'mr-auto bg-gray-200 text-brand-darkBlue'
                  } rounded-lg p-2 max-w-[80%]`}
                >
                  {msg.text}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex p-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
                placeholder="質問を入力..."
              />
              <button
                type="submit"
                className="bg-brand-teal text-white px-3 py-2 rounded-r-md hover:bg-brand-cyan"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBox;