import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Headset, Bell, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 z-10">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Headset size={16} strokeWidth={2.2} />
        </div>
        <span className="text-sm font-semibold text-slate-900 tracking-tight">Support CRM</span>
      </button>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowProfileMenu(false);
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white shadow-lg py-2 z-20">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Notifications
              </div>
              <div className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu((v) => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              KM
            </div>
            <span className="text-sm text-slate-700 font-medium">Krishna Mishra</span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-20">
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Profile
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Settings
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}