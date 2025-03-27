import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.extend(relativeTime);
dayjs.locale("ja");

// 時間を「○時間前」「○日前」形式に変換する関数
const formatTime = (timestamp) => {
  return dayjs(timestamp).fromNow();
};

export default function NotificationDropdown({ 
  showTenantName = true,
  notifications = [] // デフォルト値を空配列に
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("unreplied"); // タブ状態

  const unreadCount = notifications.filter((notif) => !notif.replied).length;
  const filteredNotifications =
    activeTab === "unreplied"
      ? notifications.filter((notif) => !notif.replied)
      : notifications;

  return (
    <li className="relative">
      {/* 通知アイコン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-white/20 rounded-full p-1 transition relative"
      >
        <img src="/images/notifications.svg" alt="Notifications" className="w-8 h-8 rounded-full" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 通知ドロップダウン */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-96 bg-white shadow-lg rounded-lg p-2 text-black z-50">
          <h4 className="font-bold text-lg">通知一覧</h4>

          {/* タブ切り替え */}
          <div className="flex border-b w-1/2">
            <button
              className={`flex-1 py-1 text-sm text-center ${activeTab === "unreplied" ? "border-b-2 border-brand-orange text-sm font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("unreplied")}
            >
              未返信 ({unreadCount})
            </button>
            <button
              className={`flex-1 py-1 text-sm text-center ${activeTab === "all" ? "border-b-2 border-brand-orange text-sm font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("all")}
            >
              すべて
            </button>
          </div>

          {/* スクロール可能エリア */}
          <div className="max-h-96 overflow-y-auto">
            <ul className="mt-2">
              {filteredNotifications.map((notif) => (
                <li key={notif.id} className="flex items-center space-x-3 p-4 mr-2 rounded-lg hover:bg-gray-100 transition relative">
                  <img src={notif.userImg} alt="User Avatar" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    {/* テナント名を表示するかどうか制御 */}
                    {showTenantName && (
                      <p className="text-xs font-bold text-brand-teal">{notif.tenantName}</p>
                    )}
                    <p className="text-sm font-semibold">{notif.department}</p>
                    <p className="text-xs text-gray-600">{notif.title}</p>
                    <p className="text-xs text-gray-800">{notif.comment}</p>
                  </div>
                  <span className="text-xs text-gray-500 px-2">{formatTime(notif.time)}</span>
                  {!notif.replied && (
                    <span className="absolute top-2 right-2 bg-red-500 w-3 h-3 rounded-full"></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}