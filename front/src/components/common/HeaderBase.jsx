import Link from "next/link";
import { jost } from "@/styles/fonts";
import NotificationWithDropdown from "./NotificationWithDropdown";

export default function Header({ 
  UserRole, 
  menuItems, 
  bgColor = "bg-brand-teal", 
  showTenantName = false, 
  showNav = false,
  iconPath = "/",
  notifications = []
}) {
  return (
    <header className={`${jost.variable} ${bgColor} text-white h-12 px-4 flex justify-between items-center shadow-md sticky top-0 z-50`}>
      {/* ロゴ＆UserName */}
      <Link href={iconPath} passHref>
        <div className="flex items-center cursor-pointer">
          <h1 className="pl-4 text-3xl font-bold font-jost">Motiva</h1>
          <span className="text-sm font-jost mb-2 font-bold">{UserRole}</span>
        </div>
      </Link>

      {/* ナビゲーション（表示・非表示を制御） */}
      {showNav && (
        <nav>
          <ul className="flex items-center space-x-4">
            {/* 動的にメニューを追加 */}
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} passHref>
                  <span className="px-4 py-2 rounded-lg transition-all hover:bg-brand-orange hover:text-white hover:font-bold cursor-pointer">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
            {/* 通知アイコン (コンポーネント化) */}
            <NotificationWithDropdown 
              showTenantName={showTenantName} 
              notifications={notifications}
            />
            {/* ユーザーアイコン */}
            <li>
              <button className="hover:bg-white/20 rounded-full p-1 transition">
                <img src="/images/Generic_avatar.svg" alt="User Avatar" className="w-8 h-8 rounded-full" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}