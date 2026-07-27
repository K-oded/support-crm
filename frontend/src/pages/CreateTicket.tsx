import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { createTicket } from '../services/ticketService';

interface FormData {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
}

interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  description?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.customerName.trim()) errors.customerName = 'Customer name is required.';
  if (!data.customerEmail.trim()) {
    errors.customerEmail = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
    errors.customerEmail = 'Please enter a valid email address.';
  }
  if (!data.subject.trim()) errors.subject = 'Subject is required.';
  if (!data.description.trim()) {
    errors.description = 'Issue description is required.';
  } else if (data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  }
  return errors;
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-100'
  }`;

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    const ticket = await createTicket(form);
console.log("CREATED TICKET:", ticket);
navigate(`/ticket/${ticket.id}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      {/* Page header */}
      <div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Create New Ticket</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Fill in the details below to open a support ticket.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Customer Name" error={errors.customerName} required>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={handleChange('customerName')}
                  placeholder="e.g. Amara Osei"
                  className={inputClass(!!errors.customerName)}
                  autoComplete="name"
                />
              </Field>

              <Field label="Customer Email" error={errors.customerEmail} required>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={handleChange('customerEmail')}
                  placeholder="e.g. amara@company.com"
                  className={inputClass(!!errors.customerEmail)}
                  autoComplete="email"
                />
              </Field>
            </div>

            <Field label="Subject" error={errors.subject} required>
              <input
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                placeholder="Brief summary of the issue"
                className={inputClass(!!errors.subject)}
              />
            </Field>

            <Field label="Issue Description" error={errors.description} required>
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                placeholder="Describe the issue in detail — include steps to reproduce, affected users, and any error messages."
                rows={6}
                className={`${inputClass(!!errors.description)} resize-none leading-relaxed`}
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 rounded-b-xl">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send size={14} strokeWidth={2} />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
