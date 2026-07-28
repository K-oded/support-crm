import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Plus,
  Ticket,
  CircleDot,
  Clock,
  CheckCircle2,
  ChevronDown,
  Eye,
  ArrowUpDown,
} from 'lucide-react';
import { getTickets } from '../services/ticketService';
import type { Ticket as TicketType, TicketStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { useNotifications } from '../components/NotificationContext';

type FilterStatus = 'All' | TicketStatus;

const statusOptions: FilterStatus[] = ['All', 'Open', 'In Progress', 'Closed'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [isLoading] = useState(false);

  const [tickets, setTickets] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  // remembers the last alert level we saw for each ticket, so we only notify on a *change*
  const prevAlertLevels = useRef<Record<string, 'none' | 'attention' | 'overdue'>>({});

  useEffect(() => {
    const loadTickets = async () => {
      const data = await getTickets();
      setTickets(data);
    };

    loadTickets();
  }, []);

  // periodic re-render so alerts update live without user interaction
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const getTicketAlert = (ticket: TicketType) => {
    if (ticket.status === 'Closed') return null;

    const raw = ticket.updatedAt;
    const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(raw);
    const isoString = hasTimezone ? raw : raw + 'Z';

    const updated = new Date(isoString).getTime();
    const now = Date.now();
    const minutes = (now - updated) / (1000 * 60);

    if (minutes >= 5) {
      return {
        level: 'overdue' as const,
        label: 'Overdue',
        color: 'border-red-400 bg-red-50',
        badge: 'text-red-700 bg-red-100',
      };
    }

    if (minutes >= 2) {
      return {
        level: 'attention' as const,
        label: 'Needs Attention',
        color: 'border-blue-400 bg-blue-50',
        badge: 'text-blue-700 bg-blue-100',
      };
    }

    return null;
  };

  // detect alert-level transitions on every tick/render and notify via the shared context
  useEffect(() => {
    tickets.forEach((ticket) => {
      const alert = getTicketAlert(ticket);
      const currentLevel = alert?.level ?? 'none';
      const prevLevel = prevAlertLevels.current[ticket.id] ?? 'none';

      if (currentLevel !== prevLevel && currentLevel !== 'none') {
        addNotification({
          ticketId: ticket.id,
          subject: ticket.subject,
          level: currentLevel,
        });
      }

      prevAlertLevels.current[ticket.id] = currentLevel;
    });
  }, [tickets]);

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'Open').length,
      inProgress: tickets.filter((t) => t.status === 'In Progress').length,
      closed: tickets.filter((t) => t.status === 'Closed').length,
    }),
    [tickets]
  );

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchesFilter = filter === 'All' || t.status === filter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [tickets, filter, search]);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Tickets</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and resolve customer support requests</p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Tickets" value={stats.total} icon={Ticket} accent="text-blue-600" bg="bg-blue-100" />
        <StatCard label="Open" value={stats.open} icon={CircleDot} accent="text-red-600" bg="bg-red-50" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} accent="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Closed" value={stats.closed} icon={CheckCircle2} accent="text-emerald-600" bg="bg-emerald-50" />
      </div>

      {/* Filters + search */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tickets, customers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:block">Status</span>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterStatus)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 font-medium tabular-nums">
              {filtered.length}
            </span>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-4"><LoadingState /></div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Ticket ID', 'Customer', 'Subject', 'Status', 'Created', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap first:pl-5 last:pr-5">
                      {h && (
                        <span className="flex items-center gap-1">
                          {h}
                          {h !== '' && <ArrowUpDown size={11} className="text-slate-300" />}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((ticket) => {
                  const alert = getTicketAlert(ticket);

                  return (
                    <tr
                      key={ticket.id}
                      className={`group transition-all duration-200 hover:bg-blue-50/50 ${
                        alert ? alert.color : ''
                      }`}
                    >
                      <td className="pl-5 pr-4 py-3.5 font-mono text-sm font-semibold text-blue-700">
                        {ticket.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800">{ticket.customerName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{ticket.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <span className="line-clamp-1 font-medium text-slate-800">{ticket.subject}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={ticket.status} />
                        {alert && (
                          <div className={`mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${alert.badge}`}>
                            {alert.label}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="pr-5 pl-4 py-3.5">
                        <button
                          onClick={() => navigate(`/ticket/${ticket.id}`)}
                          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-300 hover:bg-blue-100 transition-all"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}