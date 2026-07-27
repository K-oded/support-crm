import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Tag,
  Calendar,
  RefreshCw,
  MessageSquare,
  Send,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { getTicketById, updateTicketStatus, addNote } from '../services/ticketService';
import type { TicketStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

const statusOptions: TicketStatus[] = ['Open', 'In Progress', 'Closed'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="mt-0.5 text-sm text-slate-800 break-all">{value}</p>
      </div>
    </div>
  );
}

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const loadTicket = async () => {
    if (!id) return;

    const data = await getTicketById(id);
    setTicket(data);
    setLoading(false);
  };

  loadTicket();
}, [id]);

  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(
    ticket?.status ?? 'Open'
  );
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [saved, setSaved] = useState(false);
  
  if (loading) {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
    </div>
  );
}

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <AlertTriangle size={24} />
        </div>
        <div className="text-center">
          <h2 className="text-base font-semibold text-slate-800">Ticket not found</h2>
          <p className="mt-1 text-sm text-slate-500">
            The ticket you&apos;re looking for doesn&apos;t exist or was removed.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-2 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSaveStatus = async () => {
    setIsSaving(true);

    const updated = await updateTicketStatus(
      ticket.id,
      selectedStatus,
      '' // no note-input UI wired up for status changes yet
    );

    setTicket(updated);

    setIsSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setIsAddingNote(true);
    await new Promise((r) => setTimeout(r, 400));
    const updated = await addNote(ticket.id, note.trim());
    if (updated) setTicket({ ...updated });
    setNote('');
    setIsAddingNote(false);
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddNote();
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-slate-900">{ticket.subject}</h1>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1 font-mono">{ticket.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: main content */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Description */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Issue Description
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare size={15} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-800">Notes & Activity</h2>
              <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                {(ticket.notes ?? []).length}
              </span>
            </div>

            {(ticket.notes ?? []).length > 0 ? (
              <div className="divide-y divide-slate-50">
                {(ticket.notes ?? []).map((n) => (
                  <div key={n.id} className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {n.author
                          .split(' ')
                          .map((p) => p[0])
                          .join('')}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{n.author}</span>
                      <span className="text-xs text-slate-400 ml-auto">{formatDateTime(n.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pl-8">{n.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">No notes yet. Add the first one below.</p>
              </div>
            )}

            {/* Add note */}
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={handleNoteKeyDown}
                placeholder="Add a note… (Cmd+Enter to submit)"
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddNote}
                  disabled={!note.trim() || isAddingNote}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isAddingNote ? (
                    <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <Send size={12} />
                  )}
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="flex flex-col gap-4">
          {/* Ticket info */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Ticket Details
            </h2>
            <InfoRow
              icon={<User size={14} />}
              label="Customer"
              value={ticket.customerName}
            />
            <InfoRow
              icon={<Mail size={14} />}
              label="Email"
              value={ticket.customerEmail}
            />
            <InfoRow
              icon={<Tag size={14} />}
              label="Ticket ID"
              value={ticket.id}
            />
            <InfoRow
              icon={<Calendar size={14} />}
              label="Created"
              value={formatDate(ticket.createdAt)}
            />
            <InfoRow
              icon={<RefreshCw size={14} />}
              label="Last Updated"
              value={formatDate(ticket.updatedAt)}
            />
          </div>

          {/* Status update */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Update Status
            </h2>
            <div className="relative mb-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-800 font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            <button
              onClick={handleSaveStatus}
              disabled={isSaving || selectedStatus === ticket.status}
              className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                saved
                  ? 'bg-emerald-600 text-white focus-visible:ring-emerald-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-blue-500'
              }`}
            >
              {isSaving ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}