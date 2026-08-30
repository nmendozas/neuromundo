import { LoginForm } from '@/components/admin/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 p-6">
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-clinical-500/20 blur-3xl" />
      <LoginForm />
    </main>
  );
}
