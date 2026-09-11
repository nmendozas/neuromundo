import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/api';
import { Sidebar } from '@/components/admin/Sidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
      <Sidebar username={user.name || user.username} />
      <main className="flex-1 p-6 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
