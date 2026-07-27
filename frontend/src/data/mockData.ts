import type { Ticket } from '../types';

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-1001',
    customerName: 'Amara Osei',
    customerEmail: 'amara.osei@techflow.io',
    subject: 'Unable to export reports to PDF',
    description:
      'When I navigate to Reports > Export and select PDF format, the download never starts. The spinner appears for about 3 seconds and then disappears. I have tried multiple browsers (Chrome 124, Firefox 125) and the issue persists. This is blocking our monthly audit process.',
    status: 'Open',
    createdAt: '2026-07-18T09:14:00Z',
    updatedAt: '2026-07-18T09:14:00Z',
    notes: [
      {
        id: 'n1',
        author: 'Jordan Kim',
        content: 'Reproduced the issue on our staging environment. Escalating to backend team.',
        createdAt: '2026-07-18T10:30:00Z',
      },
    ],
  },
  {
    id: 'TKT-1002',
    customerName: 'Lena Vogel',
    customerEmail: 'lena.vogel@nordic-labs.com',
    subject: 'Two-factor authentication not sending SMS codes',
    description:
      'Since your last deployment on July 15th, 2FA SMS codes are no longer arriving. Email-based 2FA still works. Affects all users in our organization (approximately 40 accounts). We have confirmed the phone numbers on file are correct.',
    status: 'In Progress',
    createdAt: '2026-07-17T14:22:00Z',
    updatedAt: '2026-07-20T08:45:00Z',
    notes: [
      {
        id: 'n2',
        author: 'Marcus Chen',
        content: 'Our telephony provider had a service disruption. Mitigation deployed at 3:00 PM UTC.',
        createdAt: '2026-07-17T15:00:00Z',
      },
      {
        id: 'n3',
        author: 'Marcus Chen',
        content:
          'Confirmed fix is live. Asking the customer to retry and confirm resolution before closing.',
        createdAt: '2026-07-20T08:45:00Z',
      },
    ],
  },
  {
    id: 'TKT-1003',
    customerName: 'Sebastián Ruiz',
    customerEmail: 's.ruiz@constructora-andes.cl',
    subject: 'Billing discrepancy on July invoice',
    description:
      'Our July invoice shows a charge of $1,240 for the Professional plan, but our contract rate is $980/month. We upgraded from Starter in April and were told the new rate would take effect from May. Please review and issue a corrected invoice.',
    status: 'Closed',
    createdAt: '2026-07-10T11:05:00Z',
    updatedAt: '2026-07-14T16:30:00Z',
    notes: [
      {
        id: 'n4',
        author: 'Priya Nair',
        content: 'Confirmed the contract rate. Billing team issued a $260 credit. Closed.',
        createdAt: '2026-07-14T16:30:00Z',
      },
    ],
  },
  {
    id: 'TKT-1004',
    customerName: 'Fatimah Al-Rashidi',
    customerEmail: 'fatimah@crescentdigital.ae',
    subject: 'API rate limits returning 429 unexpectedly',
    description:
      'Our integration is receiving 429 Too Many Requests responses even though our request volume is well within the documented 1,000 req/min limit. We log about 200 requests per minute. This started around July 19th at 08:00 UTC.',
    status: 'Open',
    createdAt: '2026-07-19T10:50:00Z',
    updatedAt: '2026-07-19T10:50:00Z',
    notes: [],
  },
  {
    id: 'TKT-1005',
    customerName: 'Tomáš Novák',
    customerEmail: 'tomas.novak@pivnipalace.cz',
    subject: 'Dashboard widgets not loading after role change',
    description:
      'After promoting a user from Viewer to Editor, their dashboard shows empty widget panels with a "No data available" message. Other Editor accounts work fine. Logging out and back in does not resolve the issue.',
    status: 'In Progress',
    createdAt: '2026-07-21T07:33:00Z',
    updatedAt: '2026-07-22T09:10:00Z',
    notes: [
      {
        id: 'n5',
        author: 'Jordan Kim',
        content: 'Cache invalidation bug confirmed. Fix in review, targeting Thursday release.',
        createdAt: '2026-07-22T09:10:00Z',
      },
    ],
  },
  {
    id: 'TKT-1006',
    customerName: 'Yuki Tanaka',
    customerEmail: 'y.tanaka@kaizen-analytics.jp',
    subject: 'CSV import silently skipping rows with special characters',
    description:
      "Importing a CSV with Japanese characters in address fields results in a success message, but those rows don't appear in the system. Rows with ASCII-only content import correctly. File encoding is UTF-8.",
    status: 'Open',
    createdAt: '2026-07-22T13:41:00Z',
    updatedAt: '2026-07-22T13:41:00Z',
    notes: [],
  },
  {
    id: 'TKT-1007',
    customerName: 'Chiara Moretti',
    customerEmail: 'chiara.m@atelier-roma.it',
    subject: 'Password reset link expiring too quickly',
    description:
      'Customers are reporting that password reset links expire before they can act on them. The link appears to be valid for under 5 minutes. Our users expect at least 24 hours per industry standard. This is causing support volume to spike.',
    status: 'Closed',
    createdAt: '2026-07-05T09:00:00Z',
    updatedAt: '2026-07-09T11:20:00Z',
    notes: [
      {
        id: 'n6',
        author: 'Priya Nair',
        content: 'Configuration error found — TTL was set to 300s instead of 86400s. Deployed fix.',
        createdAt: '2026-07-09T11:20:00Z',
      },
    ],
  },
  {
    id: 'TKT-1008',
    customerName: 'Kwame Asante',
    customerEmail: 'kwame@savannatech.gh',
    subject: 'Webhook deliveries failing with 503 from our server',
    description:
      'We are receiving 503 responses from our webhook endpoint, but the endpoint is healthy — our monitoring confirms it. We suspect the issue is on the sending side. Could you check if there are IP addresses we need to allowlist?',
    status: 'Closed',
    createdAt: '2026-07-12T16:20:00Z',
    updatedAt: '2026-07-13T14:05:00Z',
    notes: [
      {
        id: 'n7',
        author: 'Marcus Chen',
        content: 'Provided updated egress IP list. Customer confirmed allowlist updated and webhooks flowing.',
        createdAt: '2026-07-13T14:05:00Z',
      },
    ],
  },
];
