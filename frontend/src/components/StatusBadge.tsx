import type { TicketStatus } from '../types';

const config: Record<TicketStatus, { label: string; className: string }> = {
  Open: {
    label: 'Open',
    className: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  },
  Closed: {
    label: 'Closed',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
};


export default function StatusBadge({ status }: { status: TicketStatus }) {
  console.log("STATUS RECEIVED:", status);

  if (!status || !config[status]) {
    console.log("INVALID STATUS:", status);
    return null;
  }

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Open'
            ? 'bg-red-500'
            : status === 'In Progress'
              ? 'bg-orange-500'
              : 'bg-emerald-500'
        }`}
      />
      {label}
    </span>
  );
}