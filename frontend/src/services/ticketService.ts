import type { Ticket, TicketStatus, Note } from '../types';
import api from './api';

const mapTicket = (ticket: any): Ticket => ({
  id: ticket.ticket_id,
  customerName: ticket.customer_name,
  customerEmail: ticket.customer_email,
  subject: ticket.subject,
  description: ticket.description,
  status: ticket.status,
  createdAt: ticket.created_at,
  updatedAt: ticket.updated_at,
  notes: (ticket.notes || []).map((note: any) => ({
    id: String(note.id),
    author: 'Support Agent',
    content: note.note_text,
    createdAt: note.created_at,
  })),
});

export const getTickets = async (): Promise<Ticket[]> => {
  const response = await api.get('/tickets');
  return response.data.map(mapTicket);
};

export const getTicketById = async (id: string): Promise<Ticket> => {
  const response = await api.get(`/tickets/${id}`);
  return mapTicket(response.data);
};

export const createTicket = async (data: {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
}): Promise<Ticket> => {
  const response = await api.post('/tickets', {
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    subject: data.subject,
    description: data.description,
  });

  return mapTicket(response.data);
};

export const updateTicketStatus = async (
  id: string,
  status: TicketStatus,
  noteText: string
): Promise<Ticket> => {
  const response = await api.put(`/tickets/${id}`, {
    status,
    note_text: noteText,
  });

  return mapTicket(response.data);
};

export const addNote = async (
  id: string,
  content: string
): Promise<Ticket> => {
  const response = await api.post(`/tickets/${id}/notes`, {
    note_text: content,
  });

  return mapTicket(response.data);
};