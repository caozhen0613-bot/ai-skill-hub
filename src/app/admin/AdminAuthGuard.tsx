import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session || role !== 'ADMIN') {
    redirect('/api/auth/signin');
  }

  return <>{children}</>;
}
