export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export interface Note {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
}
