import { createBrowserRouter, Outlet } from 'react-router';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import { NotificationProvider } from './components/NotificationContext';

function Root() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </NotificationProvider>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-5xl font-bold text-slate-200">404</p>
      <h2 className="mt-3 text-base font-semibold text-slate-700">Page not found</h2>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: 'create', Component: CreateTicket },
      { path: 'ticket/:id', Component: TicketDetail },
      { path: '*', Component: NotFound },
    ],
  },
]);