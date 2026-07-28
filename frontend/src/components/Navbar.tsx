import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Headset, Bell, ChevronDown, AlertCircle, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../components/NotificationContext';

function timeAgo(ts: number) {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

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
              if (!showNotifications) markAllRead();
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg py-2 z-20 max-h-96 overflow-y-auto">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide sticky top-0 bg-white">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-sm text-slate-400 text-center">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markRead(n.id);
                      setShowNotifications(false);
                      navigate(`/ticket/${n.ticketId}`);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {n.level === 'overdue' ? (
                      <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">
                        {n.level === 'overdue' ? 'Ticket Overdue' : 'Needs Attention'}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {n.ticketId} — {n.subject}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                  </button>
                ))
              )}
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