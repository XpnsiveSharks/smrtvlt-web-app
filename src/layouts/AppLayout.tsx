import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

export const AppLayout = () => (
  <div className="flex h-screen overflow-hidden text-text-primary page-glow bg-[var(--bg-page)]">
    <Sidebar />
    <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
      <Header />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </div>
    </main>
  </div>
);
